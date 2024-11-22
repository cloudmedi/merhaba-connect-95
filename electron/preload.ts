import { contextBridge, ipcRenderer } from 'electron';
import os from 'os';

contextBridge.exposeInMainWorld('electronAPI', {
  generateToken: () => ipcRenderer.invoke('generate-token'),
  getSystemInfo: () => ({
    cpuUsage: os.loadavg()[0],
    memoryUsage: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
    diskSpace: 0, // TODO: Implement disk space check
  }),
});