import WebSocket from 'ws';

export class WebSocketConnectionManager {
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;

  constructor(
    private supabaseUrl: string,
    private onConnectionEstablished: (ws: WebSocket) => void,
    private onConnectionFailed: () => void
  ) {}

  connect(token: string) {
    if (this.isConnecting) {
      console.log('WebSocketConnectionManager: Connection already in progress');
      return;
    }

    this.isConnecting = true;
    console.log('WebSocketConnectionManager: Starting WebSocket initialization');

    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('WebSocketConnectionManager: Max reconnection attempts reached');
        return;
      }

      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${token}`;
      console.log('WebSocketConnectionManager: Connecting to URL:', wsUrl);
      console.log('WebSocketConnectionManager: Connection attempt:', this.reconnectAttempts + 1);
      
      const ws = new WebSocket(wsUrl, {
        headers: {
          'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${token}`
        }
      });

      this.onConnectionEstablished(ws);

    } catch (error) {
      console.error('WebSocketConnectionManager: Error creating connection:', error);
      this.handleReconnect(token);
    }
  }

  private handleReconnect(token: string) {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    console.log(`WebSocketConnectionManager: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect(token);
    }, this.reconnectDelay * Math.min(this.reconnectAttempts, 5));
  }

  resetConnection() {
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}