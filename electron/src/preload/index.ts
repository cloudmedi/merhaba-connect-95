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
  onDownloadProgress: (callback: (data: { songId: string; progress: number }) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on('download-progress', handler);
    return () => {
      ipcRenderer.removeListener('download-progress', handler);
    };
  },
  // WebSocket events
  onWebSocketMessage: (callback: (data: any) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on('websocket-message', handler);
    return () => {
      ipcRenderer.removeListener('websocket-message', handler);
    };
  },
  onPlaylistReceived: (callback: (playlist: any) => void) => {
    const handler = (_event: any, playlist: any) => {
      console.log('Playlist received in preload:', playlist);
      callback(playlist);
    };
    ipcRenderer.on('playlist-received', handler);
    return () => {
      ipcRenderer.removeListener('playlist-received', handler);
    };
  },
  onWebSocketConnected: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('websocket-connected', handler);
    return () => {
      ipcRenderer.removeListener('websocket-connected', handler);
    };
  },
  onWebSocketError: (callback: (error: string) => void) => {
    const handler = (_event: any, error: string) => callback(error);
    ipcRenderer.on('websocket-error', handler);
    return () => {
      ipcRenderer.removeListener('websocket-error', handler);
    };
  },
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('register-device', deviceInfo)
})