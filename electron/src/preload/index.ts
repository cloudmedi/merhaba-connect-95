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
  // Add new download-related methods
  startPlaylistDownload: (playlistId: string) => 
    ipcRenderer.invoke('start-playlist-download', playlistId),
  getDownloadStatus: (playlistId: string) => 
    ipcRenderer.invoke('get-download-status', playlistId),
  checkSongDownloaded: (songId: string) => 
    ipcRenderer.invoke('check-song-downloaded', songId),
  onDownloadProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('download-progress', (_event, value) => callback(value))
  }
})