import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import * as si from 'systeminformation'
import dotenv from 'dotenv'
import { getDeviceIdentifier } from '../utils/deviceIdentifier'
import { supabase } from '../integrations/supabase/mainClient'

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') })
dotenv.config({ path: path.join(__dirname, '../../.env') })

// Check environment variables
const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables')
}

let win: BrowserWindow | null

async function generateDeviceToken(macAddress: string) {
  try {
    const token = Math.random().toString(36).substring(2, 8).toUpperCase()
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)

    const { data, error } = await supabase
      .from('device_tokens')
      .insert({
        token,
        mac_address: macAddress,
        status: 'active',
        expires_at: expirationDate.toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data.token
  } catch (error) {
    console.error('Error generating token:', error)
    throw error
  }
}

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
    })
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
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

// IPC handlers
ipcMain.handle('get-system-info', getSystemInfo)
ipcMain.handle('get-device-id', getDeviceIdentifier)
ipcMain.handle('get-mac-address', getMacAddress)
ipcMain.handle('generate-device-token', async () => {
  const macAddress = await getMacAddress()
  if (!macAddress) throw new Error('Could not get MAC address')
  return generateDeviceToken(macAddress)
})