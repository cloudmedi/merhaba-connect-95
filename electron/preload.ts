import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('register-device', deviceInfo),
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  onSyncStatusChange: (callback: (status: string) => void) => 
    ipcRenderer.on('sync-status', (_, status) => callback(status)),
});