import { BrowserWindow } from 'electron';
import { FileSystemManager } from '../services/FileSystemManager';
import { DownloadManager } from '../services/DownloadManager';
import { OfflinePlaylistManager } from '../services/OfflinePlaylistManager';

export async function handlePlaylistSync(event: Electron.IpcMainInvokeEvent, playlist: any) {
  console.log('Received playlist sync request:', JSON.stringify(playlist, null, 2));
  
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    console.error('Window not found');
    return { success: false, error: 'Window not found' };
  }

  try {
    const deviceToken = await event.sender.invoke('get-device-id');
    if (!deviceToken) {
      throw new Error('No device token available');
    }

    const fileSystemManager = new FileSystemManager(deviceToken);
    const downloadManager = new DownloadManager(fileSystemManager);
    const offlineManager = new OfflinePlaylistManager(fileSystemManager, downloadManager);

    console.log('Starting playlist sync process...');
    const result = await offlineManager.syncPlaylist(playlist);

    if (result.success) {
      // Update playlist with local file paths
      const updatedPlaylist = {
        ...playlist,
        songs: playlist.songs.map((song: any) => ({
          ...song,
          file_url: fileSystemManager.getLocalUrl(song.id)
        }))
      };

      console.log('Sending updated playlist to renderer:', updatedPlaylist);
      win.webContents.send('playlist-updated', updatedPlaylist);
    }

    return result;
  } catch (error) {
    console.error('Error syncing playlist:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}