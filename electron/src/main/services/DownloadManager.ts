import fetch from 'node-fetch';
import * as fs from 'fs-extra';
import { FileSystemManager } from './FileSystemManager';
import * as crypto from 'crypto';

export class DownloadManager {
  private downloadProgress: { [key: string]: number } = {};

  constructor(private fileSystem: FileSystemManager) {}

  getProgress(songId: string): number {
    return this.downloadProgress[songId] || 0;
  }

  async downloadSong(songId: string, url: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      console.log(`Starting download for song ${songId} from ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to download: ${response.statusText}`);
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
      let downloaded = 0;
      const chunks: Buffer[] = [];

      // @ts-ignore - Node fetch types don't include body.on
      for await (const chunk of response.body) {
        chunks.push(chunk);
        downloaded += chunk.length;
        
        // Update progress
        const progress = (downloaded / contentLength) * 100;
        this.downloadProgress[songId] = progress;
        console.log(`Download progress for song ${songId}: ${progress.toFixed(2)}%`);
      }

      const buffer = Buffer.concat(chunks);
      console.log(`Downloaded ${buffer.length} bytes for song ${songId}`);
      
      const hash = await this.fileSystem.saveSong(songId, buffer);
      console.log(`Saved song ${songId} with hash ${hash}`);

      // Clear progress after successful download
      delete this.downloadProgress[songId];

      return { success: true, hash };
    } catch (error) {
      console.error(`Error downloading song ${songId}:`, error);
      delete this.downloadProgress[songId];
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
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