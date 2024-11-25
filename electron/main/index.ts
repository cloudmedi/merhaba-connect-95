import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import Store from 'electron-store';
import { Howl } from 'howler';

const store = new Store();
let mainWindow: BrowserWindow | null = null;
let audioPlayer: Howl | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js')
    },
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#ffffff'
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('get-device-id', () => {
  return store.get('deviceId');
});

ipcMain.handle('play-audio', async (event, url) => {
  if (audioPlayer) {
    audioPlayer.unload();
  }

  audioPlayer = new Howl({
    src: [url],
    html5: true
  });

  audioPlayer.play();
});

ipcMain.handle('pause-audio', () => {
  audioPlayer?.pause();
});

ipcMain.handle('stop-audio', () => {
  audioPlayer?.stop();
});

ipcMain.handle('set-volume', (event, volume) => {
  if (audioPlayer) {
    audioPlayer.volume(volume);
  }
});