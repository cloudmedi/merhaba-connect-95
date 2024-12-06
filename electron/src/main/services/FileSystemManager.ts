import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';

export class FileSystemManager {
  private readonly baseDir: string;
  private readonly deviceId: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
    this.baseDir = path.join(app.getPath('userData'), 'offline-music', deviceId);
    this.initializeDirectories();
    console.log('FileSystemManager initialized with base directory:', this.baseDir);
  }

  private initializeDirectories() {
    const dirs = [
      path.join(this.baseDir, 'songs'),
      path.join(this.baseDir, 'playlists')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('Created directory:', dir);
      }
    });
  }

  async saveSong(songId: string, songBuffer: Buffer): Promise<string> {
    const filePath = this.getSongPath(songId);
    console.log('Saving song to:', filePath);
    
    try {
      await fs.ensureDir(path.dirname(filePath));
      console.log('Ensured directory exists:', path.dirname(filePath));

      await fs.writeFile(filePath, songBuffer);
      console.log('Successfully wrote file');

      const exists = await fs.pathExists(filePath);
      if (!exists) {
        throw new Error('File was not written successfully');
      }

      const hash = this.calculateFileHash(songBuffer);
      console.log('Song saved successfully with hash:', hash);
      
      const stats = await fs.stat(filePath);
      console.log(`Saved file size: ${stats.size} bytes`);
      
      if (stats.size === 0) {
        throw new Error('Saved file is empty');
      }
      
      return hash;
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  }

  getSongPath(songId: string): string {
    return path.join(this.baseDir, 'songs', `song_${songId}.mp3`);
  }

  async songExists(songId: string): Promise<boolean> {
    const filePath = this.getSongPath(songId);
    const exists = fs.existsSync(filePath);
    console.log(`Checking if song ${songId} exists at ${filePath}:`, exists);
    if (exists) {
      const stats = await fs.stat(filePath);
      console.log(`Existing song file size: ${stats.size} bytes`);
    }
    return exists;
  }

  private calculateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async getStorageStats(): Promise<{ used: number; total: number }> {
    const songDir = path.join(this.baseDir, 'songs');
    let used = 0;

    try {
      const files = await fs.readdir(songDir);
      for (const file of files) {
        const stats = await fs.stat(path.join(songDir, file));
        used += stats.size;
      }

      return {
        used,
        total: await this.getDiskSpace()
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw error;
    }
  }

  private async getDiskSpace(): Promise<number> {
    // Default to 1GB if we can't get disk space
    return 1024 * 1024 * 1024;
  }

  async cleanup(keepSongIds: string[]): Promise<void> {
    const songDir = path.join(this.baseDir, 'songs');
    console.log('Starting cleanup. Keeping songs:', keepSongIds);
    
    try {
      const files = await fs.readdir(songDir);
      for (const file of files) {
        const songId = file.replace('song_', '').replace('.mp3', '');
        if (!keepSongIds.includes(songId)) {
          console.log('Removing unused song:', file);
          await fs.unlink(path.join(songDir, file));
        }
      }
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }
}