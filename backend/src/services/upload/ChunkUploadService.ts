import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds timeout
const MAX_CONCURRENT_UPLOADS = 3;
const PROGRESS_THROTTLE = 100; // 100ms

export class ChunkUploadService {
  private abortController: AbortController | null = null;
  private isUploading: boolean = false;
  private totalChunks: number = 0;
  private uploadedChunks: number = 0;
  private totalBytes: number = 0;
  private uploadedBytes: number = 0;
  private lastProgressUpdate: number = 0;

  constructor(private onProgress?: (progress: number) => void) {}

  public cancel() {
    if (this.isUploading && this.abortController) {
      this.isUploading = false;
      this.abortController.abort();
      logger.debug('Upload cancelled');
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
        const errorText = await response.text();
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }

      this.uploadedChunks++;
      this.uploadedBytes += chunk.length;
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
    if (now - this.lastProgressUpdate > PROGRESS_THROTTLE) {
      const progress = Math.floor((this.uploadedBytes / this.totalBytes) * 100);
      this.onProgress?.(progress);
      this.lastProgressUpdate = now;
      logger.debug(`Upload progress: ${progress}% (${this.uploadedBytes}/${this.totalBytes} bytes)`);
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
    this.uploadedBytes = 0;
    this.totalBytes = buffer.length;
    this.lastProgressUpdate = 0;

    try {
      const uniqueFileName = `music/${fileName}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${uniqueFileName}`;
      
      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length)));
      }

      this.totalChunks = chunks.length;
      logger.info(`Starting upload of ${fileName} (${buffer.length} bytes) in ${chunks.length} chunks`);
      
      // Paralel yükleme (3 chunk aynı anda)
      for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_UPLOADS) {
        const chunkGroup = chunks.slice(i, i + MAX_CONCURRENT_UPLOADS);
        const uploadPromises = chunkGroup.map((chunk, index) => {
          const start = (i + index) * CHUNK_SIZE;
          return this.uploadChunk(bunnyUrl, chunk, start, buffer.length);
        });

        await Promise.all(uploadPromises);
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${uniqueFileName}`;
      logger.info(`Upload completed: ${cdnUrl}`);
      
      // Son progress güncellemesi
      this.onProgress?.(100);
      
      return cdnUrl;

    } catch (error) {
      logger.error('File upload error:', error);
      throw error;
    } finally {
      this.isUploading = false;
      this.abortController = null;
    }
  }
}