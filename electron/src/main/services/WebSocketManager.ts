import WebSocket from 'ws';
import { BrowserWindow } from 'electron';
import { WebSocketEventHandlers } from './WebSocketEventHandlers';
import { WebSocketConnectionManager } from './WebSocketConnectionManager';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private eventHandlers: WebSocketEventHandlers | null = null;
  private connectionManager: WebSocketConnectionManager;
  private messageQueue: any[] = [];

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
  }

  private initializeWebSocket() {
    this.connectionManager.connect(this.token);
  }

  private handleConnectionEstablished(ws: WebSocket) {
    this.ws = ws;
    this.eventHandlers = new WebSocketEventHandlers(
      ws,
      this.win,
      this.messageQueue,
      () => this.connectionManager.resetConnection()
    );
    this.eventHandlers.setupEventHandlers();
  }

  private handleConnectionFailed() {
    console.error('WebSocketManager: Connection failed');
  }

  public sendMessage(message: any) {
    console.log('WebSocketManager: Attempting to send message:', message);
    this.messageQueue.push(message);
    
    if (this.ws?.readyState === WebSocket.OPEN && this.eventHandlers) {
      while (this.messageQueue.length > 0) {
        const nextMessage = this.messageQueue.shift();
        this.eventHandlers.sendMessage(nextMessage);
      }
    } else {
      console.log('WebSocketManager: Connection not ready, message queued');
    }
  }

  public async disconnect() {
    console.log('WebSocketManager: Disconnecting');
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
      this.eventHandlers = null;
      this.messageQueue = [];
      console.log('WebSocketManager: Disconnected successfully');
    } else {
      console.log('WebSocketManager: No active connection to disconnect');
    }
  }
}