import { WebSocket } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';

export class DeviceManager {
  private connectedDevices = new Map<string, WebSocket>();

  addDevice(token: string, socket: WebSocket) {
    console.log('DeviceManager: Device connected:', token);
    console.log('DeviceManager: Current device count:', this.connectedDevices.size);
    this.connectedDevices.set(token, socket);
  }

  removeDevice(token: string) {
    console.log('DeviceManager: Device disconnected:', token);
    console.log('DeviceManager: Remaining devices:', this.connectedDevices.size - 1);
    this.connectedDevices.delete(token);
  }

  getDeviceSocket(token: string): WebSocket | undefined {
    const socket = this.connectedDevices.get(token);
    console.log('DeviceManager: Getting socket for device:', token);
    console.log('DeviceManager: Socket found:', !!socket);
    return socket;
  }

  isDeviceConnected(token: string): boolean {
    const isConnected = this.connectedDevices.has(token);
    console.log('DeviceManager: Checking device connection:', token);
    console.log('DeviceManager: Device is connected:', isConnected);
    return isConnected;
  }

  broadcastPresenceUpdate(token: string, status: 'online' | 'offline') {
    console.log('DeviceManager: Broadcasting presence update:', token, status);
    console.log('DeviceManager: Broadcasting to devices:', this.connectedDevices.size);
    this.connectedDevices.forEach((socket, deviceToken) => {
      try {
        socket.send(JSON.stringify({
          type: 'presence_update',
          payload: { 
            token,
            status,
            timestamp: new Date().toISOString()
          }
        }));
        console.log('DeviceManager: Presence update sent to device:', deviceToken);
      } catch (error) {
        console.error('DeviceManager: Error sending presence update to device:', deviceToken, error);
      }
    });
  }
}