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

      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('token')
        .in('id', selectedDevices)
        .single();

      console.log('Device data query result:', { deviceData, deviceError });

      if (deviceError || !deviceData?.token) {
        console.error('Device token query error:', deviceError);
        throw new Error('Cihaz token\'ı bulunamadı');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        console.error('Supabase URL not found in env');
        throw new Error('Supabase URL not found');
      }

      const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${deviceData.token}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection opened, sending playlist data');
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
        console.log('WebSocket response received:', response);
        
        if (response.type === 'sync_success') {
          console.log('Sync successful:', response);
          toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
          onClose();
        } else if (response.type === 'error') {
          console.error('Sync error:', response);
          toast.error(`Hata: ${response.payload.message}`);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log('WebSocket readyState:', ws.readyState);
        console.log('WebSocket bufferedAmount:', ws.bufferedAmount);
        toast.error("Bağlantı hatası oluştu");
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsSyncing(false);
      };

    } catch (error) {
      console.error('Error in handlePush:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handlePush
  };
}