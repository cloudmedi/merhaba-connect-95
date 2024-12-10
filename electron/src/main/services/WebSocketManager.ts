import WebSocket from 'ws';
import { BrowserWindow } from 'electron';
import { WebSocketEventHandlers } from './WebSocketEventHandlers';
import { WebSocketConnectionManager } from './WebSocketConnectionManager';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private eventHandlers: WebSocketEventHandlers | null = null;
  private connectionManager: WebSocketConnectionManager;
  private messageQueue: any[] = [];
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  constructor(private token: string, private win: BrowserWindow | null) {
    console.log('WebSocketManager: Constructor called with token:', token);
    console.log('WebSocketManager: Window reference:', win ? 'exists' : 'null');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    if (!supabaseUrl) {
      console.error('WebSocketManager: Missing Supabase URL');
      return;
    }

    if (!token) {
      console.error('WebSocketManager: No token provided');
      return;
    }

    this.connectionManager = new WebSocketConnectionManager(
      supabaseUrl,
      this.handleConnectionEstablished.bind(this),
      this.handleConnectionFailed.bind(this)
    );

    this.initializeWebSocket();
    this.startConnectionCheck();
  }

  private startConnectionCheck() {
    console.log('WebSocketManager: Starting connection check interval');
    this.reconnectInterval = setInterval(() => {
      console.log('WebSocketManager: Checking connection status:', this.isConnected);
      if (!this.isConnected) {
        console.log('WebSocketManager: Connection lost, attempting to reconnect');
        this.initializeWebSocket();
      }
    }, 30000);
  }

  private initializeWebSocket() {
    console.log('WebSocketManager: Initializing WebSocket connection');
    this.connectionManager.connect(this.token);
  }

  private handleConnectionEstablished(ws: WebSocket) {
    console.log('WebSocketManager: Connection established successfully');
    this.ws = ws;
    this.isConnected = true;
    this.eventHandlers = new WebSocketEventHandlers(
      ws,
      this.win,
      this.messageQueue,
      () => {
        console.log('WebSocketManager: Connection reset requested');
        this.connectionManager.resetConnection();
        this.isConnected = true;
      }
    );
    this.eventHandlers.setupEventHandlers();

    // Process any queued messages
    if (this.messageQueue.length > 0) {
      console.log('WebSocketManager: Processing queued messages:', this.messageQueue.length);
    }
  }

  private handleConnectionFailed() {
    console.error('WebSocketManager: Connection failed');
    this.isConnected = false;
  }

  public sendMessage(message: any) {
    console.log('WebSocketManager: Attempting to send message:', message);
    this.messageQueue.push(message);
    
    if (this.ws?.readyState === WebSocket.OPEN && this.eventHandlers) {
      console.log('WebSocketManager: Connection is open, sending queued messages');
      while (this.messageQueue.length > 0) {
        const nextMessage = this.messageQueue.shift();
        this.eventHandlers.sendMessage(nextMessage);
      }
    } else {
      console.log('WebSocketManager: Connection not ready, message queued');
      console.log('WebSocketManager: Current WebSocket state:', this.ws?.readyState);
      if (!this.isConnected) {
        console.log('WebSocketManager: Attempting to reconnect...');
        this.initializeWebSocket();
      }
    }
  }

  public async disconnect() {
    console.log('WebSocketManager: Disconnecting');
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
      this.eventHandlers = null;
      this.messageQueue = [];
      this.isConnected = false;
      console.log('WebSocketManager: Disconnected successfully');
    } else {
      console.log('WebSocketManager: No active connection to disconnect');
    }
  }
}