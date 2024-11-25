import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import crypto from 'crypto'
import Store from 'electron-store'

// Store şemasını tanımlayalım
const schema = {
  deviceId: {
    type: 'string'
  },
  deviceToken: {
    type: 'string'
  }
}

// Store'u başlatalım
const store = new Store({ schema })

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function generateDeviceToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function initializeDevice() {
  let deviceId = store.get('deviceId') as string
  let deviceToken = store.get('deviceToken') as string

  if (!deviceId || !deviceToken) {
    deviceId = crypto.randomUUID()
    deviceToken = generateDeviceToken()
    store.set('deviceId', deviceId)
    store.set('deviceToken', deviceToken)
  }

  return { deviceId, deviceToken }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    const indexHtml = path.join(__dirname, '../renderer/index.html')
    win.loadFile(indexHtml)
  }
}

// IPC handlers
ipcMain.handle('getDeviceId', () => {
  return store.get('deviceId')
})

ipcMain.handle('getDeviceToken', () => {
  return store.get('deviceToken')
})

ipcMain.handle('registerDevice', async (event, deviceInfo) => {
  const { deviceId, deviceToken } = initializeDevice()
  return { id: deviceId, token: deviceToken }
})

app.whenReady().then(() => {
  Store.initRenderer()
  initializeDevice()
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