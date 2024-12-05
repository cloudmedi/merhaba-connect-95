import WebSocket from 'ws';
import { OfflinePlaylistManager } from './OfflinePlaylistManager';
import { FileSystemManager } from './FileSystemManager';
import { DownloadManager } from './DownloadManager';
import { supabase } from '@supabase/supabase-js';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private playlistManager: OfflinePlaylistManager;
  private supabaseUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;

  constructor(deviceToken: string) {
    const fileSystem = new FileSystemManager(deviceToken);
    const downloadManager = new DownloadManager(fileSystem);
    this.playlistManager = new OfflinePlaylistManager(fileSystem, downloadManager);
    
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    
    if (!this.supabaseUrl) {
      console.error('VITE_SUPABASE_URL is not defined in environment variables');
      return;
    }

    // Önce device_tokens tablosundan gerçek token'ı alalım
    this.initializeConnection(deviceToken);
  }

  private async initializeConnection(deviceToken: string) {
    try {
      // Device token'ı doğrula ve aktif token'ı al
      const { data: tokenData, error } = await supabase
        .from('device_tokens')
        .select('token')
        .eq('mac_address', deviceToken)
        .eq('status', 'active')
        .single();

      if (error || !tokenData) {
        console.error('Could not find active device token:', error);
        return;
      }

      console.log('Found active device token:', tokenData.token);
      this.connect(tokenData.token); // Gerçek token ile bağlan
    } catch (error) {
      console.error('Error initializing connection:', error);
    }
  }

  private async connect(realToken: string) {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }

      // Artık gerçek device token'ı kullanıyoruz
      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${realToken}`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('WebSocket connection opened successfully with token:', realToken);
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
                  token: realToken,
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
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
          setTimeout(() => this.connect(realToken), this.reconnectDelay);
        }
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
        setTimeout(() => this.connect(realToken), this.reconnectDelay);
      }
    }
  }
}