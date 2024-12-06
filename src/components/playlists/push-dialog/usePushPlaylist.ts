import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (selectedDevices: string[]) => {
    console.log('handlePush started with devices:', selectedDevices);
    
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

      // Get device tokens for selected devices
      console.log('Fetching device tokens...');
      const { data: deviceTokens, error: tokenError } = await supabase
        .from('device_tokens')
        .select('token, mac_address')
        .in('mac_address', selectedDevices)
        .in('status', ['active', 'used']);

      if (tokenError) {
        console.error('Error fetching device tokens:', tokenError);
        throw tokenError;
      }

      console.log('Device tokens:', deviceTokens);

      if (!deviceTokens || deviceTokens.length === 0) {
        console.error('No valid device tokens found');
        throw new Error('Seçili cihazlar için geçerli token bulunamadı');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not found');
      }

      // Send playlist to each selected device via WebSocket
      for (const device of deviceTokens) {
        console.log(`Initiating WebSocket connection for device ${device.mac_address}`);
        
        try {
          const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${device.token}`;
          console.log('Connecting to WebSocket URL:', wsUrl);
          
          const ws = new WebSocket(wsUrl);

          ws.onopen = () => {
            console.log(`WebSocket connected for device ${device.mac_address}`);
            ws.send(JSON.stringify({
              type: 'sync_playlist',
              payload: {
                deviceId: device.mac_address,
                playlist: {
                  id: playlist.id,
                  name: playlist.name,
                  songs: songs
                }
              }
            }));
          };

          ws.onmessage = (event) => {
            console.log(`Received WebSocket message for device ${device.mac_address}:`, event.data);
            const response = JSON.parse(event.data);
            
            if (response.type === 'sync_error') {
              console.error(`Sync error for device ${device.mac_address}:`, response.payload);
              toast.error(`${device.mac_address} cihazına gönderilirken hata oluştu: ${response.payload}`);
            }
          };

          ws.onerror = (error) => {
            console.error(`WebSocket error for device ${device.mac_address}:`, error);
            toast.error(`${device.mac_address} cihazı ile bağlantı hatası`);
          };

          // Wait for the WebSocket connection to complete
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('WebSocket connection timeout'));
            }, 10000);

            ws.onclose = () => {
              clearTimeout(timeout);
              resolve(true);
            };
          });

        } catch (wsError) {
          console.error(`WebSocket error for device ${device.mac_address}:`, wsError);
          toast.error(`${device.mac_address} cihazına bağlanılamadı`);
        }
      }

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
      onClose();
    } catch (error: any) {
      console.error('Push error:', error);
      toast.error(error.message || "Playlist gönderilirken bir hata oluştu");
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