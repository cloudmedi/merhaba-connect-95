import WebSocket from 'ws';
import { OfflinePlaylistManager } from './OfflinePlaylistManager';
import { FileSystemManager } from './FileSystemManager';
import { DownloadManager } from './DownloadManager';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private playlistManager: OfflinePlaylistManager;
  private supabaseUrl: string;

  constructor(deviceId: string) {
    const fileSystem = new FileSystemManager(deviceId);
    const downloadManager = new DownloadManager(fileSystem);
    this.playlistManager = new OfflinePlaylistManager(fileSystem, downloadManager);
    
    // Get Supabase URL from environment variables
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    
    if (!this.supabaseUrl) {
      console.error('VITE_SUPABASE_URL is not defined in environment variables');
      return;
    }

    this.connect();
  }

  private connect() {
    try {
      // Construct WebSocket URL
      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('WebSocket connection opened');
      });

      this.ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Received message:', message);

          if (message.type === 'sync_playlist') {
            const { playlist } = message.payload;
            
            // Playlist'i senkronize et
            const result = await this.playlistManager.syncPlaylist(playlist);
            
            // Sonucu gönder
            if (this.ws?.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({
                type: result.success ? 'sync_success' : 'error',
                payload: result.success ? {
                  playlistId: playlist.id
                } : result.error
              }));
            }
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket connection closed');
        // Bağlantıyı yeniden kur
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      // Retry connection after delay
      setTimeout(() => this.connect(), 5000);
    }
  }
}