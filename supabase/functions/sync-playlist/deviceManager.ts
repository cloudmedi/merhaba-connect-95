import { WebSocket } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';

export class DeviceManager {
  private connectedDevices = new Map<string, WebSocket>();

  addDevice(token: string, socket: WebSocket) {
    console.log('Adding device with token:', token);
    this.connectedDevices.set(token, socket);
  }

  removeDevice(token: string) {
    console.log('Removing device with token:', token);
    this.connectedDevices.delete(token);
  }

  getDeviceSocket(token: string): WebSocket | undefined {
    return this.connectedDevices.get(token);
  }

  isDeviceConnected(token: string): boolean {
    return this.connectedDevices.has(token);
  }
}