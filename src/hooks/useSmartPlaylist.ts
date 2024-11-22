import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlayHistory {
  song_id: string;
  play_count_today: number;
  last_played_at: string;
}

export function useSmartPlaylist(branchId: string | undefined, deviceId: string | undefined) {
  const queryClient = useQueryClient();

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
    onError: (error) => {
      toast.error("Failed to record play history", {
        description: error.message
      });
    }
  });

  // Get next song recommendation
  const getNextSong = (currentSongId: string, playlist: any[]) => {
    // If no songs in playlist, return 0
    if (playlist.length === 0) return 0;

    // For now, just return next song index
    const currentIndex = playlist.findIndex(song => song.id === currentSongId);
    return currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
  };

  return {
    recordPlay,
    getNextSong
  };
}