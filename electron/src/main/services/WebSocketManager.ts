import WebSocket from 'ws';
import { BrowserWindow } from 'electron';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private supabaseUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private win: BrowserWindow | null;
  private messageQueue: any[] = [];
  private isConnecting: boolean = false;

  constructor(token: string, win: BrowserWindow | null) {
    console.log('WebSocketManager: Constructor called with token:', token);
    console.log('WebSocketManager: Window reference:', win ? 'exists' : 'null');
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

    this.initializeWebSocket(token);
  }

  private initializeWebSocket(token: string) {
    if (this.isConnecting) {
      console.log('WebSocketManager: Connection already in progress');
      return;
    }

    this.isConnecting = true;
    console.log('WebSocketManager: Starting WebSocket initialization');

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

      this.setupWebSocketListeners();

    } catch (error) {
      console.error('WebSocketManager: Error creating connection:', error);
      this.handleReconnect(token);
    }
  }

  private setupWebSocketListeners() {
    if (!this.ws) {
      console.error('WebSocketManager: WebSocket instance is null');
      return;
    }

    this.ws.on('open', () => {
      console.log('WebSocketManager: Connection opened successfully');
      console.log('WebSocketManager: Window reference status:', this.win ? 'exists' : 'null');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      // Send any queued messages
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        console.log('WebSocketManager: Sending queued message:', message);
        this.sendMessage(message);
      }
      
      if (this.win) {
        console.log('WebSocketManager: Sending websocket-connected event to renderer');
        this.win.webContents.send('websocket-connected');
      } else {
        console.warn('WebSocketManager: Cannot send connected event - no window reference');
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
            console.warn('WebSocketManager: Cannot send playlist - no window reference');
          }
        }
        
        if (this.win) {
          console.log('WebSocketManager: Sending websocket message to renderer');
          this.win.webContents.send('websocket-message', parsedData);
        } else {
          console.warn('WebSocketManager: Cannot send message - no window reference');
        }
      } catch (error) {
        console.error('WebSocketManager: Error parsing message:', error);
      }
    });

    this.ws.on('error', (error) => {
      console.error('WebSocketManager: WebSocket error:', error);
      if (this.win) {
        this.win.webContents.send('websocket-error', error.message);
      }
    });

    this.ws.on('close', (code, reason) => {
      console.log('WebSocketManager: Connection closed', {
        code,
        reason: reason.toString(),
        wasClean: code === 1000
      });
      
      this.isConnecting = false;
      if (this.win) {
        this.win.webContents.send('websocket-disconnected');
      }

      if (code !== 1000) {
        console.log('WebSocketManager: Unclean close, attempting reconnect');
        this.handleReconnect(this.getStoredToken());
      }
    });

    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
        console.log('WebSocketManager: Ping sent');
      }
    }, 30000);
  }

  private handleReconnect(token: string) {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    console.log(`WebSocketManager: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.initializeWebSocket(token);
    }, this.reconnectDelay * Math.min(this.reconnectAttempts, 5));
  }

  private getStoredToken(): string {
    // Implement token storage/retrieval logic here
    return '';
  }

  public sendMessage(message: any) {
    console.log('WebSocketManager: Attempting to send message:', message);
    
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocketManager: Connection not ready, queueing message');
      this.messageQueue.push(message);
      return;
    }

    try {
      console.log('WebSocketManager: Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('WebSocketManager: Error sending message:', error);
      this.messageQueue.push(message);
    }
  }

  public async disconnect() {
    console.log('WebSocketManager: Disconnecting');
    if (this.ws) {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
      this.reconnectAttempts = 0;
      this.messageQueue = [];
      console.log('WebSocketManager: Disconnected successfully');
    } else {
      console.log('WebSocketManager: No active connection to disconnect');
    }
  }
}