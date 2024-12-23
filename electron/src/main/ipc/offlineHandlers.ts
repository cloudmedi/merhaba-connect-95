import { ipcMain } from 'electron';
import { WebSocketManager } from '../services/WebSocketManager';

export function setupOfflineHandlers(token: string) {
  const wsManager = new WebSocketManager(token, null);

  ipcMain.handle('sync-playlist', async (_, playlist) => {
    console.log('Received sync request for playlist:', playlist);
    
    if (!token) {
      console.error('No token available');
      return { success: false, error: 'No token available' };
    }

    try {
      console.log('Starting playlist sync via WebSocket...');
      const result = await wsManager.sendPlaylist(playlist);
      console.log('WebSocket sync result:', result);

      return result;
    } catch (error) {
      console.error('Error syncing playlist:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  });
}