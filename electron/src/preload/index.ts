import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getMacAddress: () => ipcRenderer.invoke('get-mac-address'),
  onSystemInfoUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('system-info-update', (_event, data) => callback(data))
  },
})