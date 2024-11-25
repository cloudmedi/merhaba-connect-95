import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getDeviceId: () => ipcRenderer.invoke('getDeviceId'),
  getDeviceToken: () => ipcRenderer.invoke('getDeviceToken'),
  registerDevice: (deviceInfo: any) => ipcRenderer.invoke('registerDevice', deviceInfo),
  send: (channel: string, data: any) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: Function) => {
    let validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})