import fetch from 'node-fetch';
import { FileSystemManager } from './FileSystemManager';

export class DownloadManager {
  constructor(private fileSystem: FileSystemManager) {}

  async downloadSong(songId: string, url: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      console.log(`Downloading song ${songId} from ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download song: ${response.statusText}`);
      }

      const buffer = await response.buffer();
      const hash = await this.fileSystem.saveSong(songId, buffer);

      console.log(`Successfully downloaded and saved song ${songId}`);
      return { success: true, hash };
    } catch (error) {
      console.error('Error downloading song:', error);
      return { success: false, error: error.message };
    }
  }
}