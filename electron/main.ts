import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import Store from 'electron-store';

const store = new Store();
let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Device registration and authentication
ipcMain.handle('register-device', async (event, deviceInfo) => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase
      .from('offline_players')
      .insert([{
        device_id: deviceInfo.id,
        sync_status: 'pending',
        settings: {
          autoSync: true,
          syncInterval: 30,
          maxStorageSize: 1024 * 1024 * 1024 // 1GB default
        }
      }])
      .select()
      .single();

    if (error) throw error;
    store.set('deviceId', data.id);
    return data;
  } catch (error) {
    console.error('Error registering device:', error);
    throw error;
  }
});