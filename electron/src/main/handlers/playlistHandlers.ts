import { BrowserWindow } from 'electron';
import { FileSystemManager } from '../services/FileSystemManager';

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
    console.log('FileSystemManager initialized');

    // Download and store songs
    for (const song of playlist.songs) {
      console.log(`Processing song: ${song.title}`);
      
      try {
        const songExists = await fileSystemManager.songExists(song.id);
        if (!songExists) {
          console.log(`Downloading song ${song.id} from ${song.file_url}`);
          const songUrl = song.bunny_id 
            ? `https://cloud-media.b-cdn.net/${song.bunny_id}`
            : song.file_url;
            
          await fileSystemManager.downloadSong(song.id, songUrl);
        }
        
        // Update song URL to local path
        song.file_url = fileSystemManager.getLocalUrl(song.id);
        console.log(`Updated song URL to: ${song.file_url}`);
        
      } catch (error) {
        console.error(`Error processing song ${song.id}:`, error);
      }
    }

    // Send updated playlist with local file paths back to renderer
    console.log('Sending updated playlist to renderer:', playlist);
    win.webContents.send('playlist-updated', playlist);

    return { success: true };
  } catch (error) {
    console.error('Error syncing playlist:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}