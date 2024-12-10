import { BrowserWindow } from 'electron';
import WebSocket from 'ws';

export class WebSocketEventHandlers {
  constructor(
    private ws: WebSocket,
    private win: BrowserWindow | null,
    private messageQueue: any[],
    private onConnectionSuccess: () => void
  ) {
    console.log('=== WebSocketEventHandlers: Constructor called ===');
    console.log('Window reference:', win ? 'exists' : 'null');
    console.log('Message queue length:', messageQueue.length);
  }

  setupEventHandlers() {
    console.log('=== WebSocketEventHandlers: Setting up event handlers ===');
    this.setupOpenHandler();
    this.setupMessageHandler();
    this.setupErrorHandler();
    this.setupCloseHandler();
    this.setupPingInterval();
  }

  private setupOpenHandler() {
    this.ws.on('open', () => {
      console.log('=== WebSocketEventHandlers: Connection opened ===');
      console.log('Window reference status:', this.win ? 'exists' : 'null');
      
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        console.log('Sending queued message:', JSON.stringify(message, null, 2));
        this.sendMessage(message);
      }

      if (this.win) {
        console.log('Sending websocket-connected event to renderer');
        this.win.webContents.send('websocket-connected');
      } else {
        console.warn('Cannot send connected event - no window reference');
      }

      this.onConnectionSuccess();
    });
  }

  private setupMessageHandler() {
    this.ws.on('message', (data) => {
      console.log('=== WebSocketEventHandlers: Message received ===');
      console.log('Raw message:', data.toString());
      
      try {
        const parsedData = JSON.parse(data.toString());
        console.log('Parsed message:', JSON.stringify(parsedData, null, 2));
        
        if (parsedData.type === 'sync_playlist' && parsedData.payload.playlist) {
          console.log('Playlist sync message received:', JSON.stringify(parsedData.payload.playlist, null, 2));
          if (this.win) {
            console.log('Sending playlist to renderer');
            this.win.webContents.send('playlist-received', parsedData.payload.playlist);
          } else {
            console.warn('Cannot send playlist - no window reference');
          }
        }
        
        if (this.win) {
          console.log('Sending websocket message to renderer');
          this.win.webContents.send('websocket-message', parsedData);
        } else {
          console.warn('Cannot send message - no window reference');
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  }

  private setupErrorHandler() {
    this.ws.on('error', (error) => {
      console.error('=== WebSocketEventHandlers: WebSocket error ===', error);
      if (this.win) {
        this.win.webContents.send('websocket-error', error.message);
      }
    });
  }

  private setupCloseHandler() {
    this.ws.on('close', (code, reason) => {
      console.log('=== WebSocketEventHandlers: Connection closed ===', {
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
        console.log('=== WebSocketEventHandlers: Ping sent ===');
      }
    }, 30000);
  }

  public sendMessage(message: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('=== WebSocketEventHandlers: Connection not ready, queueing message ===');
      this.messageQueue.push(message);
      return;
    }

    try {
      console.log('=== WebSocketEventHandlers: Sending message ===');
      console.log('Message:', JSON.stringify(message, null, 2));
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageQueue.push(message);
    }
  }
}