import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getMacAddress: () => ipcRenderer.invoke('get-mac-address'),
  onSystemInfoUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('system-info-update', (_event, value) => callback(value))
  },
  getEnvVars: () => new Promise((resolve) => {
    ipcRenderer.once('env-vars', (_event, vars) => resolve(vars))
  })
})