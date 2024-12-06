import { useState } from 'react';
import { toast } from 'sonner';

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

      // Send playlist to each selected device via WebSocket
      const result = await window.electronAPI.syncPlaylist({
        id: playlistId,
        name: playlistTitle,
        devices: selectedDevices
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