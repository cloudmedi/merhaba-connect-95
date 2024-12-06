import fetch from 'node-fetch';
import * as fs from 'fs-extra';
import { FileSystemManager } from './FileSystemManager';
import * as crypto from 'crypto';
import { EventEmitter } from 'events';

export class DownloadManager extends EventEmitter {
  private downloadProgress: { [key: string]: number } = {};

  constructor(private fileSystem: FileSystemManager) {
    super();
    console.log('DownloadManager initialized');
  }

  getProgress(songId: string): number {
    return this.downloadProgress[songId] || 0;
  }

  async downloadSong(songId: string, url: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      console.log(`Starting download for song ${songId} from ${url}`);
      
      if (!url) {
        throw new Error('URL is missing');
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to download: ${response.statusText}`);
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
      console.log(`Total file size: ${contentLength} bytes`);
      
      let downloaded = 0;
      const chunks: Buffer[] = [];

      // @ts-ignore - Node fetch types don't include body.on
      for await (const chunk of response.body) {
        chunks.push(chunk);
        downloaded += chunk.length;
        
        // Update progress and emit event
        const progress = (downloaded / contentLength) * 100;
        this.downloadProgress[songId] = progress;
        this.emit('progress', songId, progress);
        console.log(`Download progress for song ${songId}: ${progress.toFixed(2)}% (${downloaded}/${contentLength} bytes)`);
      }

      const buffer = Buffer.concat(chunks);
      console.log(`Downloaded ${buffer.length} bytes for song ${songId}`);
      
      if (buffer.length === 0) {
        throw new Error('Downloaded file is empty');
      }

      const hash = await this.fileSystem.saveSong(songId, buffer);
      console.log(`Saved song ${songId} with hash ${hash}`);

      // Verify file exists and has correct size
      const filePath = this.fileSystem.getSongPath(songId);
      const stats = await fs.stat(filePath);
      console.log(`Verified saved file: ${filePath}, size: ${stats.size} bytes`);

      // Clear progress after successful download
      delete this.downloadProgress[songId];
      this.emit('progress', songId, 100);

      return { success: true, hash };
    } catch (error) {
      console.error(`Error downloading song ${songId}:`, error);
      delete this.downloadProgress[songId];
      this.emit('progress', songId, 0);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async verifyDownload(songId: string, expectedHash: string): Promise<boolean> {
    try {
      const filePath = this.fileSystem.getSongPath(songId);
      const fileBuffer = await fs.readFile(filePath);
      const actualHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      const isValid = actualHash === expectedHash;
      console.log(`Verifying download for song ${songId}:`, isValid);
      return isValid;
    } catch (error) {
      console.error(`Error verifying song ${songId}:`, error);
      return false;
    }
  }
}