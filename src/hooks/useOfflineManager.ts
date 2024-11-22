import { useState } from 'react';
import { toast } from 'sonner';
import { offlineStorage } from '@/services/offlineStorage';

interface DownloadableSong {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  artwork_url?: string;
}

export function useOfflineManager() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadSong = async (song: DownloadableSong) => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      await offlineStorage.saveSong({
        ...song,
        artwork_url: song.artwork_url || ''
      });

      toast.success('Şarkı başarıyla indirildi', {
        description: `${song.title} - ${song.artist}`,
      });
    } catch (error) {
      toast.error('Şarkı indirilemedi', {
        description: error.message,
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const removeSong = async (id: string) => {
    try {
      await offlineStorage.deleteSong(id);
      toast.success('Şarkı kaldırıldı');
    } catch (error) {
      toast.error('Şarkı kaldırılamadı', {
        description: error.message,
      });
    }
  };

  const getStorageInfo = async () => {
    const totalBytes = await offlineStorage.getTotalStorageUsed();
    const totalMB = Math.round(totalBytes / (1024 * 1024));
    
    // Use the newer estimate() API for storage quota
    const estimate = await navigator.storage?.estimate();
    const quota = estimate?.quota || 0;
    
    return {
      used: totalMB,
      total: quota ? Math.round(quota / (1024 * 1024)) : undefined,
    };
  };

  return {
    downloadSong,
    removeSong,
    getStorageInfo,
    isDownloading,
    downloadProgress,
  };
}