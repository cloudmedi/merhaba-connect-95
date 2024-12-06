import { WebSocket } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';

export class DeviceManager {
  private connectedDevices = new Map<string, WebSocket>();

  addDevice(token: string, socket: WebSocket) {
    console.log('Device connected:', token);
    this.connectedDevices.set(token, socket);
  }

  removeDevice(token: string) {
    console.log('Device disconnected:', token);
    this.connectedDevices.delete(token);
  }

  getDeviceSocket(token: string): WebSocket | undefined {
    return this.connectedDevices.get(token);
  }

  isDeviceConnected(token: string): boolean {
    return this.connectedDevices.has(token);
  }

  broadcastPresenceUpdate(token: string, status: 'online' | 'offline') {
    console.log('Broadcasting presence update:', token, status);
    this.connectedDevices.forEach((socket) => {
      socket.send(JSON.stringify({
        type: 'presence_update',
        payload: { status }
      }));
    });
  }
}