import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('register-device', deviceInfo),
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  onSyncStatusChange: (callback: (status: string) => void) => 
    ipcRenderer.on('sync-status', (_, status) => callback(status)),
  playAudio: (url: string) => ipcRenderer.invoke('play-audio', url),
  pauseAudio: () => ipcRenderer.invoke('pause-audio'),
  stopAudio: () => ipcRenderer.invoke('stop-audio'),
  setVolume: (volume: number) => ipcRenderer.invoke('set-volume', volume),
  getCurrentTime: () => ipcRenderer.invoke('get-current-time'),
  setCurrentTime: (time: number) => ipcRenderer.invoke('set-current-time', time),
  onPlaybackStatusChange: (callback: (status: any) => void) =>
    ipcRenderer.on('playback-status', (_, status) => callback(status)),
});