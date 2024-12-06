import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export function usePlaylistSync(playlistId: string, playlistTitle: string) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (selectedDevices: string[]) => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      setIsSyncing(true);
      console.log('Starting WebSocket sync for devices:', selectedDevices);

      // Önce playlist verilerini çekelim
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

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not found');
      }

      const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection opened, sending playlist data');
        // Edge Function'ın beklediği formatta veri gönderiyoruz
        ws.send(JSON.stringify({
          type: 'sync_playlist',
          payload: {
            playlist: {
              id: playlist.id,
              name: playlist.name,
              songs: songs
            },
            devices: selectedDevices
          }
        }));
      };

      ws.onmessage = (event) => {
        console.log('WebSocket response received:', event.data);
        try {
          const response = JSON.parse(event.data);
          if (response.type === 'sync_success') {
            toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
          } else if (response.type === 'error') {
            toast.error(`Hata: ${response.payload.message}`);
          }
        } catch (error) {
          console.error('Error parsing WebSocket response:', error);
          toast.error("Beklenmeyen bir yanıt alındı");
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error("Bağlantı hatası oluştu");
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsSyncing(false);
      };

    } catch (error) {
      console.error('Error syncing playlist:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handleSync
  };
}