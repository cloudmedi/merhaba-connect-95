import { app, BrowserWindow } from 'electron'
import path from 'node:path'

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Geçici olarak false yapıyoruz
      webSecurity: true,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    const indexPath = path.join(__dirname, '../../renderer/index.html')
    console.log('Loading index from:', indexPath)
    win.loadFile(indexPath)
  }

  // Debug için DevTools'u açalım
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
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