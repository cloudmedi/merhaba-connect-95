import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private channels: Map<string, (data: any) => void> = new Map();

  connect(url: string) {
    this.socket = io(url);
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  channel(name: string) {
    return {
      on: (event: string, callback: (data: any) => void) => {
        const channelEvent = `${name}:${event}`;
        this.channels.set(channelEvent, callback);
        this.socket?.on(channelEvent, callback);
        return this;
      },
      subscribe: (callback?: (status: string) => void) => {
        this.socket?.emit('subscribe', name);
        callback?.('SUBSCRIBED');
        return this;
      },
      unsubscribe: () => {
        this.socket?.emit('unsubscribe', name);
        return this;
      }
    };
  }

  removeChannel(channel: string) {
    this.channels.forEach((callback, event) => {
      if (event.startsWith(channel)) {
        this.socket?.off(event, callback);
        this.channels.delete(event);
      }
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.channels.clear();
  }
}

export const websocket = new WebSocketService();