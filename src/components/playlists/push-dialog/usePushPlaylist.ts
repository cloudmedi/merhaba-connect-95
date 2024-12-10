import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (selectedDevices: string[]) => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
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

      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      // Supabase Realtime kanalı üzerinden yayın yap
      const channel = supabase.channel('playlist_sync');
      
      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Broadcasting playlist to devices:', selectedDevices);
          
          // Her cihaz için ayrı mesaj gönder
          for (const deviceId of selectedDevices) {
            await channel.send({
              type: 'broadcast',
              event: 'playlist_sync',
              payload: {
                deviceId,
                playlist: {
                  id: playlist.id,
                  name: playlist.name,
                  songs: songs
                }
              }
            });
          }
          
          toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza gönderiliyor`);
          channel.unsubscribe();
          onClose();
        }
      });

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