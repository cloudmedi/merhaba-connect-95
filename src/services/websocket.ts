import { io, Socket } from 'socket.io-client';

const WEBSOCKET_URL = 'http://localhost:5001';

class WebSocketService {
  private socket: Socket | null = null;

  constructor() {
    this.socket = io(WEBSOCKET_URL, {
      autoConnect: false,
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  connect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  subscribe(channel: string, callback: (data: any) => void) {
    this.socket?.on(channel, callback);
    return () => this.socket?.off(channel, callback);
  }

  emit(event: string, data: any) {
    if (!this.socket?.connected) {
      console.warn('WebSocket is not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  onPlaylistUpdate(callback: (data: any) => void) {
    return this.subscribe('playlist-updated', callback);
  }

  onDeviceStatus(callback: (data: any) => void) {
    return this.subscribe('device-status', callback);
  }
}

export const wsService = new WebSocketService();