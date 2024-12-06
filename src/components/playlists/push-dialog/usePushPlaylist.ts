import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (selectedDevices: string[]) => {
    console.log('handlePush started with devices:', selectedDevices);
    console.log('Playlist ID:', playlistId);
    
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

      // Send playlist to each selected device
      for (const deviceId of selectedDevices) {
        console.log(`Starting sync for device ${deviceId}`);
        
        const result = await window.electronAPI.syncPlaylist({
          id: playlist.id,
          name: playlist.name,
          songs: songs
        });

        console.log(`Sync result for device ${deviceId}:`, result);

        if (!result.success) {
          console.error(`Failed to sync playlist to device ${deviceId}:`, result.error);
          toast.error(`${deviceId} cihazına gönderilirken hata oluştu: ${result.error}`);
        }
      }

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
      onClose();
    } catch (error: any) {
      console.error('Push error:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
    } finally {
      console.log('Push process completed');
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handlePush
  };
}