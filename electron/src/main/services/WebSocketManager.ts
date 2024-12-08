import WebSocket from 'ws';
import { BrowserWindow } from 'electron';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private supabaseUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private win: BrowserWindow | null;

  constructor(token: string, win: BrowserWindow | null) {
    console.log('WebSocketManager: Initializing with token:', token);
    this.win = win;
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    
    if (!this.supabaseUrl) {
      console.error('WebSocketManager: Missing Supabase URL');
      return;
    }

    if (!token) {
      console.error('WebSocketManager: No token provided');
      return;
    }

    this.connect(token);
  }

  private connect(token: string) {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('WebSocketManager: Max reconnection attempts reached');
        return;
      }

      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${token}`;
      console.log('WebSocketManager: Connecting to URL:', wsUrl);
      console.log('WebSocketManager: Connection attempt:', this.reconnectAttempts + 1);
      
      this.ws = new WebSocket(wsUrl, {
        headers: {
          'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${token}`
        }
      });

      this.ws.on('open', () => {
        console.log('WebSocketManager: Connection opened successfully');
        console.log('WebSocketManager: Ready State:', this.ws?.readyState);
        this.reconnectAttempts = 0;
        
        if (this.win) {
          console.log('WebSocketManager: Sending websocket-connected event to renderer');
          this.win.webContents.send('websocket-connected');
        } else {
          console.warn('WebSocketManager: Window reference not available for websocket-connected event');
        }
      });

      this.ws.on('message', (data) => {
        console.log('WebSocketManager: Raw message received:', data.toString());
        try {
          const parsedData = JSON.parse(data.toString());
          console.log('WebSocketManager: Parsed message:', parsedData);
          
          if (parsedData.type === 'sync_playlist' && parsedData.payload.playlist) {
            console.log('WebSocketManager: Playlist sync message received:', parsedData.payload.playlist);
            if (this.win) {
              console.log('WebSocketManager: Sending playlist to renderer');
              this.win.webContents.send('playlist-received', parsedData.payload.playlist);
            } else {
              console.warn('WebSocketManager: Window reference not available for playlist-received event');
            }
          }
          
          if (this.win) {
            console.log('WebSocketManager: Sending websocket message to renderer');
            this.win.webContents.send('websocket-message', parsedData);
          } else {
            console.warn('WebSocketManager: Window reference not available for websocket-message event');
          }
        } catch (error) {
          console.error('WebSocketManager: Error parsing message:', error);
          console.error('WebSocketManager: Raw message that failed:', data.toString());
        }
      });

      this.ws.on('error', (error) => {
        console.error('WebSocketManager: WebSocket error:', error);
        console.error('WebSocketManager: Error details:', {
          message: error.message,
          type: error.type,
          code: error.code,
          target: error.target
        });
        
        if (this.win) {
          this.win.webContents.send('websocket-error', error.message);
        }
      });

      this.ws.on('close', (code, reason) => {
        console.log('WebSocketManager: Connection closed', {
          code,
          reason: reason.toString(),
          wasClean: code === 1000,
          reconnectAttempts: this.reconnectAttempts
        });
        
        this.reconnectAttempts++;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`WebSocketManager: Attempting to reconnect in ${this.reconnectDelay}ms...`);
          setTimeout(() => this.connect(token), this.reconnectDelay);
        }
        
        if (this.win) {
          this.win.webContents.send('websocket-disconnected');
        }
      });
    } catch (error) {
      console.error('WebSocketManager: Error creating connection:', error);
      console.error('WebSocketManager: Stack trace:', error.stack);
      
      this.reconnectAttempts++;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`WebSocketManager: Attempting to reconnect in ${this.reconnectDelay}ms...`);
        setTimeout(() => this.connect(token), this.reconnectDelay);
      }
    }
  }

  public async sendPlaylist(playlist: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocketManager: Connection not ready', {
        wsExists: !!this.ws,
        readyState: this.ws?.readyState,
        expectedState: WebSocket.OPEN
      });
      return { success: false, error: 'WebSocket connection not ready' };
    }

    try {
      console.log('WebSocketManager: Sending playlist:', playlist);
      const message = JSON.stringify({
        type: 'sync_playlist',
        payload: {
          playlist
        }
      });
      console.log('WebSocketManager: Sending message:', message);
      
      this.ws.send(message);

      if (this.win) {
        console.log('WebSocketManager: Notifying renderer of playlist sent');
        this.win.webContents.send('playlist-sent', playlist);
      } else {
        console.warn('WebSocketManager: Window reference not available for playlist-sent event');
      }

      return { success: true };
    } catch (error) {
      console.error('WebSocketManager: Error sending playlist:', error);
      console.error('WebSocketManager: Stack trace:', error.stack);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  public async disconnect() {
    if (this.ws) {
      console.log('WebSocketManager: Disconnecting');
      console.log('WebSocketManager: Current state before disconnect:', {
        readyState: this.ws.readyState,
        reconnectAttempts: this.reconnectAttempts
      });
      
      this.ws.close();
      this.ws = null;
      console.log('WebSocketManager: Disconnected successfully');
    } else {
      console.log('WebSocketManager: No active connection to disconnect');
    }
  }
}