import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  playAudio: (url: string) => ipcRenderer.invoke('play-audio', url),
  pauseAudio: () => ipcRenderer.invoke('pause-audio'),
  stopAudio: () => ipcRenderer.invoke('stop-audio'),
  setVolume: (volume: number) => ipcRenderer.invoke('set-volume', volume),
  onPlaybackStatusChange: (callback: (status: any) => void) =>
    ipcRenderer.on('playback-status', (_, status) => callback(status))
});