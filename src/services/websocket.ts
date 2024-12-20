import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class WebSocketService {
  private socket: Socket | null = null;

  constructor() {
    this.socket = io(API_URL, {
      autoConnect: false,
      transports: ['websocket']
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

  unsubscribe(channel: string) {
    this.socket?.off(channel);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export const wsService = new WebSocketService();