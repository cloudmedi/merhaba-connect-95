import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useOfflineSync(deviceId: string | null) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncPlaylists = async () => {
    if (!deviceId || isSyncing) return;

    try {
      setIsSyncing(true);
      
      // Get all playlists assigned to the device
      const { data: offlinePlaylists, error: playlistError } = await supabase
        .from('offline_playlists')
        .select('*')
        .eq('device_id', deviceId);

      if (playlistError) throw playlistError;

      // For each playlist, sync its songs
      for (const playlist of offlinePlaylists || []) {
        const { data: songs, error: songsError } = await supabase
          .from('playlist_songs')
          .select('songs(*)')
          .eq('playlist_id', playlist.playlist_id);

        if (songsError) throw songsError;

        // Update offline_songs table
        for (const song of songs || []) {
          await supabase
            .from('offline_songs')
            .upsert({
              device_id: deviceId,
              song_id: song.songs.id,
              sync_status: 'pending',
              last_synced_at: new Date().toISOString()
            });
        }
      }

      // Update sync status
      await supabase
        .from('offline_players')
        .update({
          last_sync_at: new Date().toISOString(),
          sync_status: 'completed'
        })
        .eq('device_id', deviceId);

      setLastSyncTime(new Date());
      toast.success('Sync completed successfully');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync playlists');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (deviceId) {
      // Subscribe to sync status changes
      const channel = supabase
        .channel('offline_players')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'offline_players',
            filter: `device_id=eq.${deviceId}`
          },
          (payload) => {
            if (payload.new.sync_status === 'completed') {
              setLastSyncTime(new Date(payload.new.last_sync_at));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [deviceId]);

  return {
    isSyncing,
    lastSyncTime,
    syncPlaylists
  };
}