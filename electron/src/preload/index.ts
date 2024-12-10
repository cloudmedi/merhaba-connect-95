import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  getMacAddress: () => ipcRenderer.invoke('get-mac-address'),
  onSystemInfoUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('system-info-update', (_event, value) => callback(value));
  },
  getEnvVars: () => new Promise((resolve) => {
    ipcRenderer.once('env-vars', (_event, vars) => resolve(vars));
  }),
  syncPlaylist: (playlist: any) => {
    console.log('Syncing playlist in preload:', playlist);
    return ipcRenderer.invoke('sync-playlist', playlist);
  },
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
  onPlaylistUpdated: (callback: (playlist: any) => void) => {
    console.log('Setting up playlist updated listener');
    const handler = (_event: any, playlist: any) => {
      console.log('Playlist updated in preload:', playlist);
      callback(playlist);
    };
    ipcRenderer.on('playlist-updated', handler);
    return () => {
      console.log('Removing playlist updated listener');
      ipcRenderer.removeListener('playlist-updated', handler);
    };
  },
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('register-device', deviceInfo)
});