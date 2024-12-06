import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (selectedDevices: string[]) => {
    if (selectedDevices.length === 0) {
      console.log('No devices selected');
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      setIsSyncing(true);
      console.log('Starting push process for playlist:', playlistId);
      toast.loading(`Playlist ${selectedDevices.length} cihaza gönderiliyor...`);

      // Get playlist details with songs
      console.log('Fetching playlist details...');
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

      if (playlistError) {
        console.error('Error fetching playlist:', playlistError);
        throw playlistError;
      }

      console.log('Fetched playlist:', playlist);

      // Format songs data
      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      console.log('Formatted songs:', songs);

      // Send playlist to device via WebSocket
      const result = await window.electronAPI.syncPlaylist({
        id: playlist.id,
        name: playlist.name,
        songs: songs
      });

      if (!result.success) {
        console.error('Failed to sync playlist:', result.error);
        toast.error(`Playlist gönderilirken hata oluştu: ${result.error}`);
        return;
      }

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
      onClose();
    } catch (error: any) {
      console.error('Error pushing playlist:', error);
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