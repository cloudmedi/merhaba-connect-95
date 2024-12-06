import { ipcMain } from 'electron';
import { FileSystemManager } from '../services/FileSystemManager';
import { DownloadManager } from '../services/DownloadManager';
import { OfflinePlaylistManager } from '../services/OfflinePlaylistManager';

export function setupOfflineHandlers(deviceId: string) {
  const fileSystem = new FileSystemManager(deviceId);
  const downloadManager = new DownloadManager(fileSystem);
  const playlistManager = new OfflinePlaylistManager(fileSystem, downloadManager);

  ipcMain.handle('sync-playlist', async (_, playlist) => {
    console.log('Received sync request for playlist:', playlist);
    
    if (!deviceId) {
      console.error('No device ID available');
      return { success: false, error: 'No device ID available' };
    }

    try {
      console.log('Starting playlist sync...');
      const result = await playlistManager.syncPlaylist(playlist);
      console.log('Playlist sync result:', result);

      return result;
    } catch (error) {
      console.error('Error syncing playlist:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  });

  // Yeni handler: Offline playlistleri getirmek için
  ipcMain.handle('get-offline-playlists', async () => {
    try {
      console.log('Getting offline playlists for device:', deviceId);
      const playlists = await playlistManager.getOfflinePlaylists();
      console.log('Retrieved offline playlists:', playlists);
      return playlists;
    } catch (error) {
      console.error('Error getting offline playlists:', error);
      throw error;
    }
  });

  ipcMain.handle('get-storage-stats', async () => {
    return await fileSystem.getStorageStats();
  });

  ipcMain.handle('get-download-progress', async (_, songId) => {
    return downloadManager.getProgress(songId);
  });
}