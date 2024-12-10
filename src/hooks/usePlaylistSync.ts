import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { REALTIME_CHANNEL_PREFIX, PLAYLIST_SYNC_EVENT } from "@/integrations/supabase/presence/types";

interface PlaylistSyncResult {
  success: boolean;
  error?: string;
}

export function usePlaylistSync(playlistId: string) {
  const [isSyncing, setIsSyncing] = useState(false);

  const syncToDevice = async (token: string, playlist: any, songs: any[]): Promise<PlaylistSyncResult> => {
    const channelName = `${REALTIME_CHANNEL_PREFIX}${token}`;
    const channel = supabase.channel(channelName);
    
    try {
      console.log(`Connecting to channel: ${channelName}`);
      
      // Promise'i dışarı çıkarıyoruz ve await ile bekliyoruz
      const status = await new Promise((resolve, reject) => {
        channel
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              resolve(status);
            }
            if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              reject(new Error(`Failed to subscribe: ${status}`));
            }
          });
      });

      if (status === 'SUBSCRIBED') {
        console.log(`Sending playlist to device: ${token}`);
        
        await channel.send({
          type: 'broadcast',
          event: 'broadcast',
          payload: {
            type: PLAYLIST_SYNC_EVENT,
            playlist: {
              id: playlist.id,
              name: playlist.name,
              songs: songs
            }
          }
        });
        
        console.log(`Successfully sent playlist to device: ${token}`);
        return { success: true };
      }
      
      throw new Error('Channel subscription failed');
    } catch (error: any) {
      console.error(`Error syncing to device ${token}:`, error);
      return { 
        success: false, 
        error: error.message || `Device ${token} sync failed` 
      };
    } finally {
      // Kanalı temizliyoruz
      await channel.unsubscribe();
    }
  };

  const handlePush = async (deviceTokens: string[]): Promise<PlaylistSyncResult> => {
    if (deviceTokens.length === 0) {
      return { success: false, error: "Lütfen en az bir cihaz seçin" };
    }

    try {
      setIsSyncing(true);
      console.log('Starting playlist sync for device tokens:', deviceTokens);

      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_songs (
            songs (
              id,
              title,
              artist,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('id', playlistId)
        .single();

      if (playlistError) throw playlistError;

      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      // Her cihaz için senkronizasyon yapıyoruz
      const results = await Promise.all(
        deviceTokens.map(token => 
          token ? syncToDevice(token, playlist, songs) : { success: false, error: 'Invalid token' }
        )
      );

      // Sonuçları kontrol ediyoruz
      const failedDevices = results.filter(r => !r.success);
      
      if (failedDevices.length > 0) {
        const errors = failedDevices.map(d => d.error).join(', ');
        return { 
          success: false, 
          error: `Some devices failed to sync: ${errors}` 
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error pushing playlist:', error);
      return { 
        success: false, 
        error: error.message || "Playlist gönderilirken bir hata oluştu" 
      };
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handlePush
  };
}