import WebSocket from 'ws';
import { BrowserWindow } from 'electron';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private supabaseUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private win: BrowserWindow | null;

  constructor(deviceToken: string, win: BrowserWindow | null) {
    console.log('Initializing WebSocketManager with token:', deviceToken);
    this.win = win;
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    
    if (!this.supabaseUrl) {
      console.error('Missing Supabase URL');
      return;
    }

    this.connect(deviceToken);
  }

  private async connect(token: string) {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }

      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${token}`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('WebSocket connection opened successfully');
        this.reconnectAttempts = 0;
        
        // Bağlantı başarılı olduğunda renderer'a bildir
        if (this.win) {
          this.win.webContents.send('websocket-connected');
        }
      });

      this.ws.on('message', (data) => {
        console.log('WebSocket message received:', data.toString());
        try {
          const parsedData = JSON.parse(data.toString());
          // Mesajı renderer'a ilet
          if (this.win) {
            this.win.webContents.send('websocket-message', parsedData);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (this.win) {
          this.win.webContents.send('websocket-error', error.message);
        }
      });

      this.ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.reconnectAttempts++;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
          setTimeout(() => this.connect(token), this.reconnectDelay);
        }
        if (this.win) {
          this.win.webContents.send('websocket-disconnected');
        }
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
        setTimeout(() => this.connect(token), this.reconnectDelay);
      }
    }
  }

  public async sendPlaylist(playlist: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not ready');
      return { success: false, error: 'WebSocket connection not ready' };
    }

    try {
      console.log('Sending playlist via WebSocket:', playlist);
      this.ws.send(JSON.stringify({
        type: 'sync_playlist',
        payload: {
          playlist
        }
      }));

      // Mesaj gönderildiğinde renderer'a bildir
      if (this.win) {
        this.win.webContents.send('playlist-sent', playlist);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending playlist:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  public async disconnect() {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}