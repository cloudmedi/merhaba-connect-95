import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import * as si from 'systeminformation';
import dotenv from 'dotenv';
import { WebSocketManager } from './services/WebSocketManager';
import { handlePlaylistSync } from './handlers/playlistHandlers';
import api from '../lib/api';

// Load .env files
const envPaths = [
  path.join(__dirname, '../../../.env'),
  path.join(__dirname, '../../.env')
];

envPaths.forEach(envPath => {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn(`Warning loading ${envPath}:`, result.error);
  }
});

let win: BrowserWindow | null;
let deviceToken: string | null = null;
let wsManager: WebSocketManager | null = null;

async function getMacAddress() {
  try {
    const networkInterfaces = await si.networkInterfaces();
    for (const iface of networkInterfaces) {
      if (!iface.internal && iface.mac) {
        return iface.mac;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting MAC address:', error);
    return null;
  }
}

async function getSystemInfo() {
  const cpu = await si.cpu();
  const mem = await si.mem();
  const os = await si.osInfo();
  const disk = await si.fsSize();
  const network = await si.networkInterfaces();

  return {
    cpu: {
      manufacturer: cpu.manufacturer,
      brand: cpu.brand,
      speed: cpu.speed,
      cores: cpu.cores,
    },
    memory: {
      total: mem.total,
      free: mem.free,
      used: mem.used,
    },
    os: {
      platform: os.platform,
      distro: os.distro,
      release: os.release,
      arch: os.arch,
    },
    disk: disk.map(d => ({
      fs: d.fs,
      size: d.size,
      used: d.used,
      available: d.available,
    })),
    network: network.map(n => ({
      iface: n.iface,
      ip4: n.ip4,
      mac: n.mac,
    })),
  };
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('Loading development URL:', process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
    console.log('Loading production index.html from:', indexPath);
    
    try {
      await win.loadFile(indexPath);
    } catch (error) {
      console.error('Error loading index.html:', error);
      const altPath = path.join(process.resourcesPath, 'app.asar', 'out', 'renderer', 'index.html');
      console.log('Trying alternative path:', altPath);
      await win.loadFile(altPath);
    }
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('get-system-info', getSystemInfo);
ipcMain.handle('get-mac-address', getMacAddress);
ipcMain.handle('get-device-id', () => deviceToken);

ipcMain.handle('register-device', async (_event, deviceInfo) => {
  try {
    console.log('Registering device with info:', deviceInfo);
    
    if (!deviceInfo || !deviceInfo.macAddress || !deviceInfo.systemInfo) {
      throw new Error('MAC address and system info are required');
    }
    
    // MAC adresi ile cihazı kontrol et ve kaydet
    const response = await api.post('/manager/devices/register', {
      macAddress: deviceInfo.macAddress,
      systemInfo: deviceInfo.systemInfo
    });

    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server');
    }
    
    deviceToken = response.data.token;
    console.log('Device token received and stored:', deviceToken);
    
    if (wsManager) {
      await wsManager.disconnect();
    }
    wsManager = new WebSocketManager(deviceToken, win);
    
    return {
      success: true,
      token: deviceToken
    };
  } catch (error) {
    console.error('Error registering device:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Playlist sync handler
ipcMain.handle('sync-playlist', handlePlaylistSync);
