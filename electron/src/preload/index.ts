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
  getOfflinePlaylists: () => ipcRenderer.invoke('get-offline-playlists'),
  getStorageStats: () => ipcRenderer.invoke('get-storage-stats')
})