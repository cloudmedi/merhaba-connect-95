import { app, BrowserWindow } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬ out
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ └─┬ renderer
// │   └── index.html

const DIST_PATH = app.isPackaged 
  ? path.join(__dirname, '../renderer') // Production build path
  : path.join(__dirname, '../../src/renderer') // Development path

const PUBLIC_PATH = app.isPackaged
  ? DIST_PATH
  : path.join(DIST_PATH, '../public')

process.env.DIST = DIST_PATH
process.env.VITE_PUBLIC = PUBLIC_PATH

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // Load the local file
    win.loadFile(path.join(DIST_PATH, 'index.html'))
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
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length === 0) {
    createWindow()
  }
})