import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import Store from 'electron-store'

const store = new Store()

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// 6 haneli token oluşturan fonksiyon
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString()
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

  // Token oluştur veya var olanı al
  let token = store.get('deviceToken') as string
  if (!token) {
    token = generateToken()
    store.set('deviceToken', token)
  }

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    const indexHtml = path.join(__dirname, '../renderer/index.html')
    win.loadFile(indexHtml).catch(e => {
      console.error('Failed to load app:', e)
    })
  }

  // Token'i renderer process'e gönder
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('device-token', token)
  })
}

app.whenReady().then(() => {
  createWindow()
  Store.initRenderer()
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

// Token'i renderer process'ten istendiğinde gönder
ipcMain.handle('get-token', () => {
  return store.get('deviceToken')
})