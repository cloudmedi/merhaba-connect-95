import { ipcMain } from 'electron';
import { WebSocketManager } from '../services/WebSocketManager';

export function setupOfflineHandlers(deviceId: string) {
  const wsManager = new WebSocketManager(deviceId, null);

  ipcMain.handle('sync-playlist', async (_, playlist) => {
    console.log('Received sync request for playlist:', playlist);
    
    if (!deviceId) {
      console.error('No device ID available');
      return { success: false, error: 'No device ID available' };
    }

    try {
      console.log('Starting playlist sync via WebSocket...');
      
      // WebSocket üzerinden playlist'i gönder
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