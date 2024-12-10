import { WebSocket } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';

export class DeviceManager {
  private connectedDevices = new Map<string, WebSocket>();

  addDevice(token: string, socket: WebSocket) {
    console.log('=== DeviceManager: Adding device ===');
    console.log('Token:', token);
    console.log('Current device count:', this.connectedDevices.size);
    this.connectedDevices.set(token, socket);
    console.log('New device count:', this.connectedDevices.size);
    this.logConnectedDevices();
  }

  removeDevice(token: string) {
    console.log('=== DeviceManager: Removing device ===');
    console.log('Token:', token);
    console.log('Current device count:', this.connectedDevices.size);
    this.connectedDevices.delete(token);
    console.log('Remaining devices:', this.connectedDevices.size);
    this.logConnectedDevices();
  }

  getDeviceSocket(token: string): WebSocket | undefined {
    console.log('=== DeviceManager: Getting device socket ===');
    console.log('Requested token:', token);
    const socket = this.connectedDevices.get(token);
    console.log('Socket found:', !!socket);
    if (socket) {
      console.log('Socket ready state:', socket.readyState);
    }
    return socket;
  }

  isDeviceConnected(token: string): boolean {
    console.log('=== DeviceManager: Checking device connection ===');
    console.log('Token:', token);
    const isConnected = this.connectedDevices.has(token);
    console.log('Is connected:', isConnected);
    return isConnected;
  }

  broadcastPresenceUpdate(token: string, status: 'online' | 'offline') {
    console.log('=== DeviceManager: Broadcasting presence update ===');
    console.log('Token:', token);
    console.log('Status:', status);
    console.log('Broadcasting to devices:', this.connectedDevices.size);
    
    this.connectedDevices.forEach((socket, deviceToken) => {
      try {
        const message = JSON.stringify({
          type: 'presence_update',
          payload: { 
            token,
            status,
            timestamp: new Date().toISOString()
          }
        });
        console.log(`Sending presence update to device: ${deviceToken}`);
        socket.send(message);
        console.log('Presence update sent successfully');
      } catch (error) {
        console.error(`Error sending presence update to device: ${deviceToken}`, error);
      }
    });
  }

  private logConnectedDevices() {
    console.log('=== Connected Devices ===');
    this.connectedDevices.forEach((socket, token) => {
      console.log(`Device ${token}: Ready State = ${socket.readyState}`);
    });
  }
}