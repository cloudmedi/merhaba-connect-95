import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (selectedDevices: string[]) => {
    if (selectedDevices.length === 0) {
      return { success: false, error: "Lütfen en az bir cihaz seçin" };
    }

    try {
      setIsSyncing(true);
      console.log('Starting playlist sync for devices:', selectedDevices);

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

      // Get device tokens for the selected device IDs
      const { data: devices } = await supabase
        .from('devices')
        .select('token')
        .in('id', selectedDevices);

      if (!devices) {
        throw new Error('Device tokens could not be retrieved');
      }

      const deviceTokens = devices.map(device => device.token).filter(Boolean);
      console.log('Retrieved device tokens:', deviceTokens);

      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      // Send to each device using tokens
      for (const token of deviceTokens) {
        if (!token) continue;

        const channel = supabase.channel(`device_${token}`);
        
        await channel.send({
          type: 'broadcast',
          event: 'sync_playlist',
          payload: {
            deviceToken: token,
            playlist: {
              id: playlist.id,
              name: playlist.name,
              songs: songs
            }
          }
        });
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