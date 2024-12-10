import { BrowserWindow } from 'electron';
import WebSocket from 'ws';
import { REALTIME_CHANNEL_PREFIX } from '../../types/events';

export class WebSocketConnectionManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000;
  private isConnecting = false;

  constructor(
    private deviceToken: string,
    private win: BrowserWindow | null,
    private supabaseUrl: string,
    private supabaseKey: string
  ) {}

  async connect() {
    if (this.isConnecting) {
      console.log('Connection attempt already in progress');
      return;
    }

    this.isConnecting = true;

    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.notifyRenderer('connection-failed');
        return;
      }

      const channelName = `${REALTIME_CHANNEL_PREFIX}${this.deviceToken}`;
      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/realtime/v1/websocket?apikey=${this.supabaseKey}&vsn=1.0.0`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      console.log('Channel name:', channelName);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyRenderer('connected');

        // Join the channel
        const joinMessage = {
          topic: channelName,
          event: "phx_join",
          payload: {},
          ref: Date.now()
        };
        
        this.ws?.send(JSON.stringify(joinMessage));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log('WebSocket message received:', data);

          if (data.event === "phx_reply" && data.payload.status === "ok") {
            console.log('Successfully joined channel:', channelName);
          }

          this.notifyRenderer('message', data);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleConnectionError();
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleConnectionError();
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.handleConnectionError();
    }
  }

  private handleConnectionError() {
    this.isConnecting = false;
    this.reconnectAttempts++;
    this.notifyRenderer('disconnected');

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Reconnecting in ${this.reconnectDelay}ms... (Attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  private notifyRenderer(status: 'connected' | 'disconnected' | 'connection-failed' | 'message', data?: any) {
    if (this.win) {
      this.win.webContents.send(`websocket-${status}`, data);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }
}