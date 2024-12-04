import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import * as si from 'systeminformation'
import dotenv from 'dotenv'
import { getDeviceIdentifier } from '../utils/deviceIdentifier'
import fs from 'fs-extra'
import { supabase } from '../integrations/supabase/client'

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

// Define download manager types
interface DownloadQueue {
  [playlistId: string]: {
    songs: Array<{
      id: string;
      bunnyId: string;
      status: 'pending' | 'downloading' | 'completed' | 'error';
      progress: number;
    }>;
    totalSongs: number;
    completedSongs: number;
  }
}

let downloadQueue: DownloadQueue = {};
const MUSIC_DIR = path.join(app.getPath('userData'), 'music');

// Ensure music directory exists
fs.ensureDirSync(MUSIC_DIR);

async function initializeDownloadManager() {
  // Create necessary directories
  await fs.ensureDir(MUSIC_DIR);
  
  // Initialize download status from database
  const { data: offlineSongs } = await supabase
    .from('offline_songs')
    .select('*')
    .eq('device_id', await getDeviceIdentifier());
    
  // Restore download queue state
  if (offlineSongs) {
    // Implementation will be added
  }
}

async function downloadSong(bunnyId: string, playlistId: string, songId: string) {
  const songDir = path.join(MUSIC_DIR, playlistId);
  await fs.ensureDir(songDir);
  
  const filePath = path.join(songDir, `${songId}.mp3`);
  const fileUrl = `https://cloud-media.b-cdn.net/${bunnyId}`;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Download failed');

    const fileStream = fs.createWriteStream(filePath);
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') || '0');

    if (!reader) throw new Error('Unable to read stream');

    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      receivedLength += value.length;
      fileStream.write(Buffer.from(value));

      // Calculate and send progress
      const progress = (receivedLength / contentLength) * 100;
      if (win) {
        win.webContents.send('download-progress', {
          playlistId,
          songId,
          progress: Math.round(progress)
        });
      }
    }

    fileStream.end();

    // Update database
    await supabase
      .from('offline_songs')
      .upsert({
        device_id: await getDeviceIdentifier(),
        song_id: songId,
        local_path: filePath,
        sync_status: 'completed',
        last_synced_at: new Date().toISOString()
      });

    return filePath;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

// IPC Handlers
ipcMain.handle('start-playlist-download', async (_, playlistId: string) => {
  try {
    const { data: playlist } = await supabase
      .from('playlist_songs')
      .select(`
        songs (
          id,
          bunny_id
        )
      `)
      .eq('playlist_id', playlistId);

    if (!playlist) throw new Error('Playlist not found');

    downloadQueue[playlistId] = {
      songs: playlist.map(ps => ({
        id: ps.songs.id,
        bunnyId: ps.songs.bunny_id,
        status: 'pending',
        progress: 0
      })),
      totalSongs: playlist.length,
      completedSongs: 0
    };

    // Start downloading songs
    for (const song of downloadQueue[playlistId].songs) {
      try {
        song.status = 'downloading';
        await downloadSong(song.bunnyId, playlistId, song.id);
        song.status = 'completed';
        downloadQueue[playlistId].completedSongs++;
      } catch (error) {
        song.status = 'error';
        console.error(`Failed to download song ${song.id}:`, error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to start playlist download:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-download-status', async (_, playlistId: string) => {
  return downloadQueue[playlistId] || null;
});

ipcMain.handle('check-song-downloaded', async (_, songId: string) => {
  const { data } = await supabase
    .from('offline_songs')
    .select('local_path')
    .eq('song_id', songId)
    .eq('device_id', await getDeviceIdentifier())
    .single();

  if (data?.local_path) {
    try {
      await fs.access(data.local_path);
      return { downloaded: true, path: data.local_path };
    } catch {
      return { downloaded: false };
    }
  }

  return { downloaded: false };
});

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
  });

  win.webContents.on('did-finish-load', () => {
    if (!win) return;

    win.webContents.send('env-vars', {
      VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY
    });
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(async () => {
  await initializeDownloadManager();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('get-system-info', getSystemInfo);
ipcMain.handle('get-device-id', getDeviceIdentifier);
ipcMain.handle('get-mac-address', getMacAddress);

