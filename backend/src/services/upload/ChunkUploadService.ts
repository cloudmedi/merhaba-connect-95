import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 512 * 1024; // 512KB chunks - daha küçük chunk boyutu
const MAX_RETRIES = 5; // Retry sayısını artırdık
const TIMEOUT = 60000; // 60 saniye timeout
const MAX_CONCURRENT_UPLOADS = 2; // Paralel yükleme sayısını azalttık
const PROGRESS_THROTTLE = 250; // Progress güncelleme aralığını artırdık

export class ChunkUploadService {
  private abortController: AbortController | null = null;
  private isUploading: boolean = false;
  private totalChunks: number = 0;
  private uploadedChunks: number = 0;
  private totalBytes: number = 0;
  private uploadedBytes: number = 0;
  private lastProgressUpdate: number = 0;
  private retryDelays: number[] = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  constructor(private onProgress?: (progress: number) => void) {
    logger.info('ChunkUploadService initialized');
  }

  public cancel() {
    if (this.isUploading && this.abortController) {
      this.isUploading = false;
      this.abortController.abort();
      logger.info('Upload cancelled by user');
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
      logger.info('Upload cancelled, stopping chunk upload');
      throw new Error('Upload cancelled');
    }

    try {
      logger.debug(`Uploading chunk: ${start}-${start + chunk.length - 1}/${total}`);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Content-Type': 'application/octet-stream',
          'Content-Range': `bytes ${start}-${start + chunk.length - 1}/${total}`,
          'Content-Length': chunk.length.toString()
        },
        body: chunk,
        signal: this.abortController?.signal,
        timeout: TIMEOUT
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Chunk upload failed: ${response.status} - ${errorText}`);
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }

      this.uploadedChunks++;
      this.uploadedBytes += chunk.length;
      this.updateProgress();
      
      logger.debug(`Chunk uploaded successfully: ${start}-${start + chunk.length - 1}/${total}`);
      return true;

    } catch (error: any) {
      logger.error(`Chunk upload error (attempt ${retryCount + 1}):`, {
        error: error.message,
        chunk: { start, length: chunk.length, total }
      });
      
      if (retryCount < MAX_RETRIES && this.isUploading) {
        const delay = this.retryDelays[retryCount] || this.retryDelays[this.retryDelays.length - 1];
        logger.info(`Retrying chunk upload after ${delay}ms`);
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
      logger.error('Another upload is in progress');
      throw new Error('Another upload is in progress');
    }

    if (!buffer || buffer.length === 0) {
      logger.error('Invalid buffer provided');
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
      
      logger.info(`Starting upload of ${fileName}`, {
        size: buffer.length,
        chunkSize: CHUNK_SIZE,
        maxConcurrent: MAX_CONCURRENT_UPLOADS
      });

      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length)));
      }

      this.totalChunks = chunks.length;
      
      // Sıralı yükleme - paralel yükleme yerine
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const start = i * CHUNK_SIZE;
        await this.uploadChunk(bunnyUrl, chunk, start, buffer.length);
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${uniqueFileName}`;
      logger.info(`Upload completed successfully: ${cdnUrl}`);
      
      this.onProgress?.(100);
      
      return cdnUrl;

    } catch (error) {
      logger.error('File upload failed:', error);
      throw error;
    } finally {
      this.isUploading = false;
      this.abortController = null;
    }
  }
}