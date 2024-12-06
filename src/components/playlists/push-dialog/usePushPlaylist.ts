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
      console.log('Starting WebSocket sync for devices:', selectedDevices);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not found');
      }

      const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection opened');
        ws.send(JSON.stringify({
          type: 'sync_playlist',
          payload: {
            playlistId,
            devices: selectedDevices
          }
        }));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('WebSocket response:', response);
        
        if (response.type === 'sync_success') {
          toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
        } else if (response.type === 'error') {
          toast.error(`Hata: ${response.payload.message}`);
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
    handlePush
  };
}