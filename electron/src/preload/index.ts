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
    console.log('Setting up download progress listener');
    const handler = (_event: any, data: any) => {
      console.log('Download progress received:', data);
      callback(data);
    };
    ipcRenderer.on('download-progress', handler);
    return () => {
      console.log('Removing download progress listener');
      ipcRenderer.removeListener('download-progress', handler);
    };
  },
  // WebSocket events
  onWebSocketMessage: (callback: (data: any) => void) => {
    console.log('Setting up WebSocket message listener');
    const handler = (_event: any, data: any) => {
      console.log('WebSocket message received in preload:', data);
      callback(data);
    };
    ipcRenderer.on('websocket-message', handler);
    return () => {
      console.log('Removing WebSocket message listener');
      ipcRenderer.removeListener('websocket-message', handler);
    };
  },
  onPlaylistReceived: (callback: (playlist: any) => void) => {
    console.log('Setting up playlist received listener');
    const handler = (_event: any, playlist: any) => {
      console.log('Playlist received in preload:', playlist);
      callback(playlist);
    };
    ipcRenderer.on('playlist-received', handler);
    return () => {
      console.log('Removing playlist received listener');
      ipcRenderer.removeListener('playlist-received', handler);
    };
  },
  onWebSocketConnected: (callback: () => void) => {
    console.log('Setting up WebSocket connected listener');
    const handler = () => {
      console.log('WebSocket connected event received');
      callback();
    };
    ipcRenderer.on('websocket-connected', handler);
    return () => {
      console.log('Removing WebSocket connected listener');
      ipcRenderer.removeListener('websocket-connected', handler);
    };
  },
  onWebSocketError: (callback: (error: string) => void) => {
    console.log('Setting up WebSocket error listener');
    const handler = (_event: any, error: string) => {
      console.log('WebSocket error received:', error);
      callback(error);
    };
    ipcRenderer.on('websocket-error', handler);
    return () => {
      console.log('Removing WebSocket error listener');
      ipcRenderer.removeListener('websocket-error', handler);
    };
  },
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('register-device', deviceInfo)
})