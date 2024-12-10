import fs from 'fs-extra';
import path from 'path';
import { app } from 'electron';
import fetch from 'node-fetch';

export class FileSystemManager {
  private basePath: string;

  constructor(deviceToken: string) {
    this.basePath = path.join(app.getPath('userData'), 'songs', deviceToken);
    fs.ensureDirSync(this.basePath);
  }

  async downloadSong(songId: string, url: string): Promise<string> {
    const filePath = this.getSongPath(songId);
    
    if (await this.songExists(songId)) {
      console.log(`Song ${songId} already exists at ${filePath}`);
      return filePath;
    }

    console.log(`Downloading song ${songId} from ${url} to ${filePath}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const buffer = await response.buffer();
      await fs.writeFile(filePath, buffer);
      
      console.log(`Successfully downloaded song ${songId}`);
      return filePath;
    } catch (error) {
      console.error(`Error downloading song ${songId}:`, error);
      throw error;
    }
  }

  async songExists(songId: string): Promise<boolean> {
    const filePath = this.getSongPath(songId);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getSongPath(songId: string): string {
    return path.join(this.basePath, `${songId}.mp3`);
  }

  getLocalUrl(songId: string): string {
    return `file://${this.getSongPath(songId)}`;
  }
}