import fs from 'fs-extra';
import path from 'path';
import { app } from 'electron';
import fetch from 'node-fetch';

export class FileSystemManager {
  private basePath: string;

  constructor(deviceToken: string) {
    // Cihaza özel dizin oluştur
    this.basePath = path.join(app.getPath('userData'), 'songs', deviceToken);
    fs.ensureDirSync(this.basePath);
    console.log('Songs directory created at:', this.basePath);
  }

  async downloadSong(songId: string, url: string): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const filePath = this.getSongPath(songId);
      console.log(`Downloading song ${songId} from ${url} to ${filePath}`);
      
      if (await this.songExists(songId)) {
        console.log(`Song ${songId} already exists at ${filePath}`);
        return { success: true, filePath };
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buffer = await response.buffer();
      await fs.writeFile(filePath, buffer);
      
      console.log(`Successfully downloaded song ${songId}`);
      return { success: true, filePath };
    } catch (error) {
      console.error(`Error downloading song ${songId}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async songExists(songId: string): Promise<boolean> {
    const filePath = this.getSongPath(songId);
    try {
      await fs.access(filePath);
      const stats = await fs.stat(filePath);
      return stats.size > 0; // Dosyanın boş olmadığından emin ol
    } catch {
      return false;
    }
  }

  getSongPath(songId: string): string {
    return path.join(this.basePath, `${songId}.mp3`);
  }

  getLocalUrl(songId: string): string {
    const filePath = this.getSongPath(songId);
    return `file://${filePath}`;
  }

  async cleanup(keepSongIds: string[]): Promise<void> {
    try {
      const files = await fs.readdir(this.basePath);
      for (const file of files) {
        const songId = path.parse(file).name;
        if (!keepSongIds.includes(songId)) {
          const filePath = path.join(this.basePath, file);
          await fs.remove(filePath);
          console.log(`Removed unused song: ${filePath}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up songs directory:', error);
    }
  }
}