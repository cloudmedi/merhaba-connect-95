import { BrowserWindow } from 'electron';
import WebSocket from 'ws';
import { verifyDeviceToken } from '../../utils/deviceToken';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000;
  private isConnecting = false;

  constructor(
    private deviceToken: string,
    private win: BrowserWindow | null
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

      const isValid = await verifyDeviceToken(this.deviceToken);
      if (!isValid) {
        console.error('Invalid device token');
        this.notifyRenderer('connection-failed');
        return;
      }

      this.ws = new WebSocket(`ws://localhost:5001?token=${this.deviceToken}`);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyRenderer('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log('WebSocket message received:', data);
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

  async sendPlaylist(playlist: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return { success: false, error: 'WebSocket not connected' };
    }

    try {
      this.ws.send(JSON.stringify({
        type: 'sync_playlist',
        payload: { playlist }
      }));
      return { success: true };
    } catch (error) {
      console.error('Error sending playlist:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
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