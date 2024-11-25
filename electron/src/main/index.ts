import { app, BrowserWindow } from 'electron'
import path from 'node:path'

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  console.log('Development URL:', VITE_DEV_SERVER_URL)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools() // Geliştirici araçlarını otomatik aç
  } else {
    const indexHtml = path.join(__dirname, '../renderer/index.html')
    console.log('Production path:', indexHtml)
    win.loadFile(indexHtml)
  }
}

app.whenReady().then(() => {
  createWindow()
  console.log('App is ready and window created')
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