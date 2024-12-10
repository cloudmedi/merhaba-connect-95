import WebSocket from 'ws';
import { BrowserWindow } from 'electron';
import { REALTIME_CHANNEL_PREFIX, PLAYLIST_SYNC_EVENT, HEARTBEAT_EVENT } from '../../../src/integrations/supabase/presence/types';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private messageQueue: any[] = [];

  constructor(private deviceToken: string, private win: BrowserWindow | null) {
    console.log('WebSocketManager: Initializing with token:', deviceToken);
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('WebSocketManager: Missing Supabase configuration');
      return;
    }

    this.initializeWebSocket();
    this.startConnectionCheck();
  }

  private startConnectionCheck() {
    console.log('Starting connection check loop');
    this.reconnectInterval = setInterval(() => {
      if (!this.isConnected) {
        console.log('Connection lost, attempting to reconnect...');
        this.initializeWebSocket();
      }
    }, 30000);
  }

  private initializeWebSocket() {
    try {
      const wsUrl = `${process.env.VITE_SUPABASE_URL.replace('https://', 'wss://')}/realtime/v1/websocket?apikey=${process.env.VITE_SUPABASE_ANON_KEY}&vsn=1.0.0`;
      console.log('Initializing WebSocket connection:', wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnected = true;

        const channelName = `${REALTIME_CHANNEL_PREFIX}${this.deviceToken}`;
        console.log('Subscribing to channel:', channelName);
        
        const joinMessage = {
          topic: channelName,
          event: "phx_join",
          payload: { 
            device_token: this.deviceToken,
            timestamp: new Date().toISOString()
          },
          ref: Date.now()
        };
        
        console.log('Sending join message:', JSON.stringify(joinMessage, null, 2));
        this.ws?.send(JSON.stringify(joinMessage));

        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          this.sendMessage(message);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log('WebSocket message received:', JSON.stringify(data, null, 2));

          if (data.event === "broadcast") {
            const payload = data.payload;
            
            if (payload.type === PLAYLIST_SYNC_EVENT && this.win) {
              console.log('Playlist sync message received:', payload);
              this.win.webContents.send('playlist-received', payload.playlist);
            } else if (payload.event === HEARTBEAT_EVENT) {
              console.log('Heartbeat received:', payload);
            }
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.isConnected = false;
    }
  }

  public async sendMessage(message: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('Connection not ready, queueing message');
      this.messageQueue.push(message);
      return;
    }

    try {
      console.log('Sending message through WebSocket:', JSON.stringify(message, null, 2));
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageQueue.push(message);
    }
  }

  public async disconnect() {
    console.log('Disconnecting WebSocket');
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