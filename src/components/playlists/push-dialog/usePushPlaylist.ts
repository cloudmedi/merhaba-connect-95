import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { sendMessage } = useWebSocketConnection();

  const handlePush = async (selectedDevices: string[]) => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      setIsSyncing(true);
      console.log('Starting WebSocket sync for devices:', selectedDevices);

      // Playlist verilerini çek
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

      // WebSocket üzerinden playlist'i gönder
      sendMessage({
        type: 'sync_playlist',
        payload: {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            songs: songs
          },
          devices: selectedDevices
        }
      });

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza gönderiliyor`);
      onClose();
    } catch (error) {
      console.error('Error syncing playlist:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handlePush
  };
}