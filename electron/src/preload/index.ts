import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getToken: () => ipcRenderer.invoke('get-token'),
  onDeviceToken: (callback: (token: string) => void) => {
    ipcRenderer.on('device-token', (_event, token) => callback(token))
  }
})