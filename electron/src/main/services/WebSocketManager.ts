import WebSocket from 'ws';
import { BrowserWindow } from 'electron';
import { WebSocketEventHandlers } from './WebSocketEventHandlers';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private eventHandlers: WebSocketEventHandlers | null = null;
  private messageQueue: any[] = [];
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(private deviceToken: string, private win: BrowserWindow | null) {
    console.log('WebSocketManager: Initializing with device token:', deviceToken);
    
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    this.supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.error('WebSocketManager: Missing Supabase credentials');
      return;
    }

    this.initializeWebSocket();
    this.startConnectionCheck();
  }

  private startConnectionCheck() {
    console.log('WebSocketManager: Starting connection check interval');
    this.reconnectInterval = setInterval(() => {
      if (!this.isConnected) {
        console.log('Connection lost, attempting to reconnect');
        this.initializeWebSocket();
      }
    }, 30000);
  }

  private initializeWebSocket() {
    try {
      // Supabase Realtime WebSocket URL'ini oluştur
      const wsUrl = `wss://${this.supabaseUrl.replace('https://', '')}/realtime/v1/websocket?apikey=${this.supabaseKey}&vsn=1.0.0`;
      console.log('WebSocketManager: Connecting to:', wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocketManager: Connection established');
        this.isConnected = true;

        // Playlist sync kanalına abone ol
        const joinMessage = {
          topic: `realtime:playlist_sync`,
          event: "phx_join",
          payload: { device_token: this.deviceToken },
          ref: Date.now()
        };
        
        this.ws?.send(JSON.stringify(joinMessage));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log('WebSocketManager: Received message:', data);

          // Kanal mesajlarını işle
          if (data.event === "broadcast" && data.payload?.deviceId === this.deviceToken) {
            console.log('Processing playlist sync message for device:', this.deviceToken);
            
            if (this.win) {
              this.win.webContents.send('playlist-received', data.payload.playlist);
            }
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocketManager: Connection error:', error);
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocketManager: Connection closed');
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.isConnected = false;
    }
  }

  public async disconnect() {
    console.log('WebSocketManager: Disconnecting');
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}