import { useState } from 'react';
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

      // Send playlist to device via WebSocket
      const result = await window.electronAPI.syncPlaylist({
        id: playlistId,
        name: playlistTitle,
        songs: []  // Songs will be fetched in the WebSocket handler
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