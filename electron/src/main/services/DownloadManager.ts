import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import { FileSystemManager } from './FileSystemManager';

export class DownloadManager {
  constructor(private fileSystem: FileSystemManager) {}

  async downloadSong(songId: string, url: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const buffer = await response.buffer();
      const hash = await this.fileSystem.saveSong(songId, buffer);

      return { success: true, hash };
    } catch (error) {
      console.error(`Error downloading song ${songId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async verifyDownload(songId: string, expectedHash: string): Promise<boolean> {
    try {
      const filePath = this.fileSystem.getSongPath(songId);
      const fileBuffer = await fs.readFile(filePath);
      const actualHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      return actualHash === expectedHash;
    } catch (error) {
      console.error(`Error verifying song ${songId}:`, error);
      return false;
    }
  }
}