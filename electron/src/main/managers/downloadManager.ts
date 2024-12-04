import { BrowserWindow } from 'electron';
import path from 'node:path';
import fs from 'fs-extra';
import { supabase } from '../../integrations/supabase/client';
import { getDeviceIdentifier } from '../../utils/deviceIdentifier';

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

export class DownloadManager {
  private downloadQueue: DownloadQueue = {};
  private musicDir: string;
  private win: BrowserWindow | null = null;

  constructor(appDataPath: string) {
    this.musicDir = path.join(appDataPath, 'music');
    fs.ensureDirSync(this.musicDir);
  }

  setWindow(window: BrowserWindow) {
    this.win = window;
  }

  async initializeDownloadManager() {
    await fs.ensureDir(this.musicDir);
    
    const { data: offlineSongs } = await supabase
      .from('offline_songs')
      .select('*')
      .eq('device_id', await getDeviceIdentifier());
      
    if (offlineSongs) {
      // Restore download queue state from offline_songs table
      // Implementation will be added in future iterations
    }
  }

  async startPlaylistDownload(playlistId: string) {
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

      this.downloadQueue[playlistId] = {
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
      for (const song of this.downloadQueue[playlistId].songs) {
        try {
          song.status = 'downloading';
          await this.downloadSong(song.bunnyId, playlistId, song.id);
          song.status = 'completed';
          this.downloadQueue[playlistId].completedSongs++;
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
  }

  private async downloadSong(bunnyId: string, playlistId: string, songId: string) {
    const songDir = path.join(this.musicDir, playlistId);
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
        if (this.win) {
          this.win.webContents.send('download-progress', {
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

  getDownloadStatus(playlistId: string) {
    return this.downloadQueue[playlistId] || null;
  }

  async checkSongDownloaded(songId: string) {
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
  }
}