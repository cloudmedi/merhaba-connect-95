import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks
const MAX_RETRIES = 3;
const TIMEOUT = 15000; // 15 seconds timeout

export class ChunkUploadService {
  private abortController: AbortController | null = null;
  private isUploading: boolean = false;
  private totalChunks: number = 0;
  private uploadedChunks: number = 0;
  private lastProgressUpdate: number = 0;
  private uploadPromise: Promise<string> | null = null;

  constructor(private onProgress?: (progress: number) => void) {}

  public cancel() {
    if (this.isUploading && this.abortController) {
      this.isUploading = false;
      this.abortController.abort();
      logger.info('Upload cancelled');
      throw new Error('Upload cancelled by user');
    }
  }

  private async uploadChunk(
    url: string, 
    chunk: Buffer, 
    start: number, 
    total: number,
    retryCount = 0
  ): Promise<boolean> {
    if (!this.isUploading) {
      throw new Error('Upload cancelled');
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Content-Type': 'application/octet-stream',
          'Content-Range': `bytes ${start}-${start + chunk.length - 1}/${total}`
        },
        body: chunk,
        signal: this.abortController?.signal,
        timeout: TIMEOUT
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      this.uploadedChunks++;
      this.updateProgress();
      return true;
    } catch (error) {
      logger.error(`Chunk upload error (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES && this.isUploading) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.uploadChunk(url, chunk, start, total, retryCount + 1);
      }
      throw error;
    }
  }

  private updateProgress() {
    const now = Date.now();
    if (now - this.lastProgressUpdate > 100) { // Throttle updates to max 10 per second
      const progress = Math.floor((this.uploadedChunks / this.totalChunks) * 100);
      this.onProgress?.(progress);
      this.lastProgressUpdate = now;
      logger.debug(`Upload progress: ${progress}%`);
    }
  }

  public async uploadFile(buffer: Buffer, fileName: string): Promise<string> {
    if (this.isUploading) {
      throw new Error('Another upload is in progress');
    }

    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid buffer provided');
    }

    this.isUploading = true;
    this.abortController = new AbortController();
    this.uploadedChunks = 0;
    this.lastProgressUpdate = 0;

    try {
      const uniqueFileName = `music/${fileName}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${uniqueFileName}`;
      
      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length)));
      }

      this.totalChunks = chunks.length;
      logger.info(`Starting upload of ${fileName} in ${chunks.length} chunks`);
      
      // Upload chunks sequentially to maintain order
      for (let i = 0; i < chunks.length; i++) {
        if (!this.isUploading) {
          throw new Error('Upload cancelled');
        }
        const chunk = chunks[i];
        const start = i * CHUNK_SIZE;
        await this.uploadChunk(bunnyUrl, chunk, start, buffer.length);
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${uniqueFileName}`;
      logger.info(`Upload completed: ${cdnUrl}`);
      
      // Final progress update
      this.onProgress?.(100);
      
      return cdnUrl;

    } catch (error) {
      logger.error('File upload error:', error);
      this.isUploading = false;
      throw error;
    } finally {
      this.isUploading = false;
      this.abortController = null;
    }
  }
}