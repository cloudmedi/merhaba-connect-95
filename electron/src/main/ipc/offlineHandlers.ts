import { ipcMain } from 'electron';
import { FileSystemManager } from '../services/FileSystemManager';
import { DownloadManager } from '../services/DownloadManager';
import { OfflinePlaylistManager } from '../services/OfflinePlaylistManager';

export function setupOfflineHandlers(deviceId: string) {
  const fileSystem = new FileSystemManager(deviceId);
  const downloadManager = new DownloadManager(fileSystem);
  const playlistManager = new OfflinePlaylistManager(fileSystem, downloadManager);

  ipcMain.handle('sync-playlist', async (_, playlist) => {
    return await playlistManager.syncPlaylist(playlist);
  });

  ipcMain.handle('get-offline-playlists', async () => {
    return await playlistManager.getOfflinePlaylists();
  });

  ipcMain.handle('get-storage-stats', async () => {
    return await fileSystem.getStorageStats();
  });
}