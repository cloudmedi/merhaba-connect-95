import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import dotenv from 'dotenv'
import { getDeviceIdentifier } from '../utils/deviceIdentifier'
import { DownloadManager } from './managers/downloadManager'

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') })
dotenv.config({ path: path.join(__dirname, '../../.env') })

// Check environment variables
const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY
  })
}

let win: BrowserWindow | null
const downloadManager = new DownloadManager(app.getPath('userData'))

// Create window function
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

  if (win) {
    downloadManager.setWindow(win)
  }

  win.webContents.on('did-finish-load', () => {
    if (!win) return

    win.webContents.send('env-vars', {
      VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY
    })
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// Initialize app
app.whenReady().then(async () => {
  await downloadManager.initializeDownloadManager()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC handlers for download management
ipcMain.handle('start-playlist-download', (_, playlistId: string) => {
  return downloadManager.startPlaylistDownload(playlistId)
})

ipcMain.handle('get-download-status', (_, playlistId: string) => {
  return downloadManager.getDownloadStatus(playlistId)
})

ipcMain.handle('check-song-downloaded', (_, songId: string) => {
  return downloadManager.checkSongDownloaded(songId)
})

// Add other IPC handlers here
ipcMain.handle('get-system-info', getSystemInfo);
ipcMain.handle('get-device-id', getDeviceIdentifier);
ipcMain.handle('get-mac-address', getMacAddress);
