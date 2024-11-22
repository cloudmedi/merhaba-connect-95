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

  // Get next song recommendation using advanced rotation algorithm
  const getNextSong = (currentSongId: string, playlist: any[]) => {
    if (!playHistory || playlist.length === 0) return 0;

    const MAX_PLAYS_PER_DAY = 10;
    const MIN_TIME_BETWEEN_PLAYS = 30 * 60 * 1000; // 30 minutes in milliseconds
    const now = new Date().getTime();

    // Calculate scores for each song based on multiple factors
    const songScores = playlist.map(song => {
      const history = playHistory.find(h => h.song_id === song.id);
      
      if (!history) {
        // Prioritize unplayed songs
        return { id: song.id, score: 100 };
      }

      // Factor 1: Daily play count limit
      if (history.play_count_today >= MAX_PLAYS_PER_DAY) {
        return { id: song.id, score: -1 }; // Exclude overplayed songs
      }

      // Factor 2: Time since last play
      const timeSinceLastPlay = now - new Date(history.last_played_at).getTime();
      if (timeSinceLastPlay < MIN_TIME_BETWEEN_PLAYS) {
        return { id: song.id, score: -1 }; // Exclude recently played songs
      }

      // Calculate base score (higher is better)
      let score = 100;

      // Reduce score based on play count today (0-50 points)
      score -= (history.play_count_today / MAX_PLAYS_PER_DAY) * 50;

      // Increase score based on time since last play (0-30 points)
      const hoursSinceLastPlay = timeSinceLastPlay / (60 * 60 * 1000);
      score += Math.min(hoursSinceLastPlay * 2, 30);

      // Add small random factor to prevent repetitive patterns (0-5 points)
      score += Math.random() * 5;

      return { id: song.id, score };
    });

    // Filter out songs with negative scores and sort by score
    const availableSongs = songScores
      .filter(song => song.score >= 0)
      .sort((a, b) => b.score - a.score);

    if (availableSongs.length === 0) {
      // If no songs are available, reset to beginning
      return 0;
    }

    // Get index of highest scoring song
    const recommendedSongId = availableSongs[0].id;
    const nextIndex = playlist.findIndex(song => song.id === recommendedSongId);

    // Fallback to sequential play if something goes wrong
    if (nextIndex === -1) {
      const currentIndex = playlist.findIndex(song => song.id === currentSongId);
      return currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
    }

    return nextIndex;
  };

  return {
    recordPlay,
    getNextSong,
    playHistory
  };
}