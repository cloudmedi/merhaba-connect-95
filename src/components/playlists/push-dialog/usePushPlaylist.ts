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
      console.log('Playlist sync başlatılıyor:', { playlistId, selectedDevices });

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
        console.error('Playlist veri hatası:', playlistError);
        throw playlistError;
      }

      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      // Her cihaz için ayrı kanal oluştur
      for (const deviceToken of selectedDevices) {
        const channelName = `device_${deviceToken}`;
        console.log(`${channelName} kanalına bağlanılıyor...`);
        
        const channel = supabase.channel(channelName);
        
        await channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`${channelName} kanalına bağlantı başarılı`);
            
            // Playlist verilerini gönder
            await channel.send({
              type: 'broadcast',
              event: 'sync_playlist',
              payload: {
                deviceToken,
                playlist: {
                  id: playlist.id,
                  name: playlist.name,
                  songs: songs
                }
              }
            });

            console.log(`Playlist ${deviceToken} cihazına gönderildi`);
            channel.unsubscribe();
          }
        });
      }

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza gönderiliyor`);
      onClose();

    } catch (error) {
      console.error('Playlist sync hatası:', error);
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