import WebSocket from 'ws';
import { OfflinePlaylistManager } from './OfflinePlaylistManager';
import { FileSystemManager } from './FileSystemManager';
import { DownloadManager } from './DownloadManager';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private playlistManager: OfflinePlaylistManager;
  private supabaseUrl: string;
  private deviceId: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
    const fileSystem = new FileSystemManager(deviceId);
    const downloadManager = new DownloadManager(fileSystem);
    this.playlistManager = new OfflinePlaylistManager(fileSystem, downloadManager);
    
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    
    if (!this.supabaseUrl) {
      console.error('VITE_SUPABASE_URL is not defined in environment variables');
      return;
    }

    this.connect();
  }

  private async connect() {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }

      // Get device token
      const { data: deviceTokens } = await fetch(`${this.supabaseUrl}/rest/v1/device_tokens?mac_address=eq.${this.deviceId}`, {
        headers: {
          'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ''}`,
        }
      }).then(res => res.json());

      const deviceToken = deviceTokens?.[0]?.token;

      // Construct WebSocket URL with device token
      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${deviceToken}`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('WebSocket connection opened');
        this.reconnectAttempts = 0;
      });

      this.ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Received message:', message);

          if (message.type === 'sync_playlist') {
            const { playlist } = message.payload;
            const result = await this.playlistManager.syncPlaylist(playlist);
            
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
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), this.reconnectDelay);
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }
}