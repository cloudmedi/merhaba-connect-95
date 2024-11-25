import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// Generate a random 6-digit token
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const token = generateToken()

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

  // Handle token request from renderer
  ipcMain.handle('get-token', () => {
    return token
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    const indexHtml = path.join(__dirname, '../renderer/index.html')
    win.loadFile(indexHtml).catch(e => {
      console.error('Failed to load app:', e)
    })
  }
}

app.whenReady().then(createWindow)

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