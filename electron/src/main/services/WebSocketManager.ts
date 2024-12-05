import WebSocket from 'ws';
import { OfflinePlaylistManager } from './OfflinePlaylistManager';
import { FileSystemManager } from './FileSystemManager';
import { DownloadManager } from './DownloadManager';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private playlistManager: OfflinePlaylistManager;
  private supabaseUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;

  constructor(deviceId: string) {
    const fileSystem = new FileSystemManager(deviceId);
    const downloadManager = new DownloadManager(fileSystem);
    this.playlistManager = new OfflinePlaylistManager(fileSystem, downloadManager);
    
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    
    if (!this.supabaseUrl) {
      console.error('VITE_SUPABASE_URL is not defined in environment variables');
      return;
    }

    this.connect(deviceId);
  }

  private formatMacAddress(mac: string): string {
    // Remove any colons or other separators and convert to lowercase
    const cleanMac = mac.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    // Add colons every two characters
    const formattedMac = cleanMac.match(/.{2}/g)?.join(':') || cleanMac;
    
    console.log('Original MAC:', mac);
    console.log('Formatted MAC:', formattedMac);
    
    return formattedMac;
  }

  private async connect(deviceId: string) {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }

      // Format MAC address to match database format
      const formattedMacAddress = this.formatMacAddress(deviceId);

      // Get device token using formatted MAC address
      const { data: deviceTokens } = await fetch(`${this.supabaseUrl}/rest/v1/device_tokens?mac_address=eq.${formattedMacAddress}&status=eq.active`, {
        headers: {
          'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ''}`,
        }
      }).then(res => res.json());

      const deviceToken = deviceTokens?.[0]?.token;
      if (!deviceToken) {
        console.error('No active device token found for MAC address:', formattedMacAddress);
        return;
      }

      console.log('Found active token for device:', deviceToken);

      // Construct WebSocket URL with device token instead of deviceId
      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${deviceToken}`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('WebSocket connection opened with token:', deviceToken);
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
                  token: deviceToken,
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
          setTimeout(() => this.connect(deviceId), this.reconnectDelay);
        }
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
        setTimeout(() => this.connect(deviceId), this.reconnectDelay);
      }
    }
  }
}