import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlayHistory {
  song_id: string;
  play_count_today: number;
  last_played_at: string;
}

export function useSmartPlaylist(branchId: string | undefined, deviceId: string | undefined) {
  const queryClient = useQueryClient();

  // Get play history for the current branch
  const { data: playHistory } = useQuery({
    queryKey: ['play-history', branchId],
    queryFn: async () => {
      if (!branchId) return [];
      
      const { data, error } = await supabase
        .from('song_play_history')
        .select('*')
        .eq('branch_id', branchId)
        .order('last_played_at', { ascending: false });

      if (error) throw error;
      return data as PlayHistory[];
    },
    enabled: !!branchId
  });

  // Record play history
  const recordPlay = useMutation({
    mutationFn: async ({ 
      songId, 
      bunnyStreamId 
    }: { 
      songId: string; 
      bunnyStreamId?: string;
    }) => {
      if (!branchId || !deviceId) {
        throw new Error('Branch ID and Device ID are required');
      }

      const { data: existing } = await supabase
        .from('song_play_history')
        .select('*')
        .eq('song_id', songId)
        .eq('branch_id', branchId)
        .eq('device_id', deviceId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('song_play_history')
          .update({ 
            play_count_today: existing.play_count_today + 1,
            last_played_at: new Date().toISOString(),
            bunny_stream_id: bunnyStreamId
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('song_play_history')
          .insert([{ 
            song_id: songId,
            branch_id: branchId,
            device_id: deviceId,
            bunny_stream_id: bunnyStreamId
          }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['play-history', branchId] });
    },
    onError: (error) => {
      toast.error("Failed to record play history", {
        description: error.message
      });
    }
  });

  // Get next song recommendation
  const getNextSong = (currentSongId: string, playlist: any[]) => {
    if (!playHistory || playlist.length === 0) return 0;

    // Filter out songs that have reached daily limit
    const availableSongs = playlist.filter(song => {
      const history = playHistory.find(h => h.song_id === song.id);
      return !history || history.play_count_today < 10; // Max 10 plays per day
    });

    if (availableSongs.length === 0) return 0;

    // Sort by last played time and play count
    const sortedSongs = availableSongs.sort((a, b) => {
      const historyA = playHistory.find(h => h.song_id === a.id);
      const historyB = playHistory.find(h => h.song_id === b.id);
      
      if (!historyA) return -1;
      if (!historyB) return 1;

      // Prioritize songs with fewer plays today
      if (historyA.play_count_today !== historyB.play_count_today) {
        return historyA.play_count_today - historyB.play_count_today;
      }

      // Then consider last played time
      return new Date(historyA.last_played_at).getTime() - 
             new Date(historyB.last_played_at).getTime();
    });

    // Find index of recommended song in original playlist
    const recommendedSong = sortedSongs[0];
    return playlist.findIndex(song => song.id === recommendedSong.id);
  };

  return {
    recordPlay,
    getNextSong,
    playHistory
  };
}