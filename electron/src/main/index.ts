import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import * as si from 'systeminformation'
import dotenv from 'dotenv'
import { setupOfflineHandlers } from './ipc/offlineHandlers'
import { WebSocketManager } from './services/WebSocketManager'

// Load .env file from project root and electron directory
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

// Check environment variables
const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables:', {
    VITE_SUPABASE_URL: !!VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!VITE_SUPABASE_ANON_KEY
  });
}

let win: BrowserWindow | null;
let deviceId: string | null = null;

async function getMacAddress() {
  try {
    const networkInterfaces = await si.networkInterfaces()
    for (const iface of networkInterfaces) {
      if (!iface.internal && iface.mac) {
        return iface.mac
      }
    }
    return null
  } catch (error) {
    console.error('Error getting MAC address:', error)
    return null
  }
}

async function getSystemInfo() {
  const cpu = await si.cpu()
  const mem = await si.mem()
  const os = await si.osInfo()
  const disk = await si.fsSize()
  const network = await si.networkInterfaces()

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
  }
}

async function initializeOfflineSupport() {
  try {
    const macAddress = await getMacAddress();
    if (!macAddress) {
      throw new Error('Could not get MAC address for device identification');
    }

    deviceId = macAddress.replace(/:/g, '');
    setupOfflineHandlers(deviceId);
    
    console.log('Initializing WebSocket with deviceId:', deviceId);
    console.log('Using Supabase URL:', VITE_SUPABASE_URL);
    
    new WebSocketManager(deviceId);
  } catch (error) {
    console.error('Error initializing offline support:', error);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  win.webContents.on('did-finish-load', () => {
    if (!win) return;
    
    win.webContents.send('env-vars', {
      VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY
    });
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // In production, load from the correct path
    const indexPath = path.join(__dirname, '../renderer/index.html');
    console.log('Loading production index.html from:', indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(async () => {
  await initializeOfflineSupport();
  createWindow();
});

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
ipcMain.handle('get-device-id', () => deviceId);
