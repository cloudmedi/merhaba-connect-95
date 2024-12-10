import { BrowserWindow } from 'electron';
import WebSocket from 'ws';

export class WebSocketEventHandlers {
  constructor(
    private ws: WebSocket,
    private win: BrowserWindow | null,
    private messageQueue: any[],
    private onConnectionSuccess: () => void
  ) {}

  setupEventHandlers() {
    this.setupOpenHandler();
    this.setupMessageHandler();
    this.setupErrorHandler();
    this.setupCloseHandler();
    this.setupPingInterval();
  }

  private setupOpenHandler() {
    this.ws.on('open', () => {
      console.log('WebSocketEventHandlers: Connection opened successfully');
      console.log('WebSocketEventHandlers: Window reference status:', this.win ? 'exists' : 'null');
      
      // Process queued messages
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        console.log('WebSocketEventHandlers: Sending queued message:', message);
        this.sendMessage(message);
      }

      if (this.win) {
        console.log('WebSocketEventHandlers: Sending websocket-connected event to renderer');
        this.win.webContents.send('websocket-connected');
      } else {
        console.warn('WebSocketEventHandlers: Cannot send connected event - no window reference');
      }

      this.onConnectionSuccess();
    });
  }

  private setupMessageHandler() {
    this.ws.on('message', (data) => {
      console.log('WebSocketEventHandlers: Raw message received:', data.toString());
      try {
        const parsedData = JSON.parse(data.toString());
        console.log('WebSocketEventHandlers: Parsed message:', parsedData);
        
        if (parsedData.type === 'sync_playlist' && parsedData.payload.playlist) {
          console.log('WebSocketEventHandlers: Playlist sync message received:', parsedData.payload.playlist);
          if (this.win) {
            console.log('WebSocketEventHandlers: Sending playlist to renderer');
            this.win.webContents.send('playlist-received', parsedData.payload.playlist);
          } else {
            console.warn('WebSocketEventHandlers: Cannot send playlist - no window reference');
          }
        }
        
        if (this.win) {
          console.log('WebSocketEventHandlers: Sending websocket message to renderer');
          this.win.webContents.send('websocket-message', parsedData);
        } else {
          console.warn('WebSocketEventHandlers: Cannot send message - no window reference');
        }
      } catch (error) {
        console.error('WebSocketEventHandlers: Error parsing message:', error);
      }
    });
  }

  private setupErrorHandler() {
    this.ws.on('error', (error) => {
      console.error('WebSocketEventHandlers: WebSocket error:', error);
      if (this.win) {
        this.win.webContents.send('websocket-error', error.message);
      }
    });
  }

  private setupCloseHandler() {
    this.ws.on('close', (code, reason) => {
      console.log('WebSocketEventHandlers: Connection closed', {
        code,
        reason: reason.toString(),
        wasClean: code === 1000
      });
      
      if (this.win) {
        this.win.webContents.send('websocket-disconnected');
      }
    });
  }

  private setupPingInterval() {
    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
        console.log('WebSocketEventHandlers: Ping sent');
      }
    }, 30000);
  }

  private sendMessage(message: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocketEventHandlers: Connection not ready, queueing message');
      this.messageQueue.push(message);
      return;
    }

    try {
      console.log('WebSocketEventHandlers: Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('WebSocketEventHandlers: Error sending message:', error);
      this.messageQueue.push(message);
    }
  }
}