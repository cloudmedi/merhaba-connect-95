import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  getMacAddress: () => ipcRenderer.invoke('get-mac-address'),
  onSystemInfoUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('system-info-update', (_event, value) => callback(value))
  },
  getEnvVars: () => new Promise((resolve) => {
    ipcRenderer.once('env-vars', (_event, vars) => resolve(vars))
  }),
  // Offline functionality
  syncPlaylist: (playlist: any) => ipcRenderer.invoke('sync-playlist', playlist),
  getStorageStats: () => ipcRenderer.invoke('get-storage-stats'),
  getDownloadProgress: (songId: string) => ipcRenderer.invoke('get-download-progress', songId),
  onDownloadProgress: (callback: (data: { songId: string, progress: number }) => void) => {
    ipcRenderer.on('download-progress', (_event, data) => callback(data))
    return () => {
      ipcRenderer.removeListener('download-progress', (_event, data) => callback(data))
    }
  },
  // Device registration
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('register-device', deviceInfo)
})