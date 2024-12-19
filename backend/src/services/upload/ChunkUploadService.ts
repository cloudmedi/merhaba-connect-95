import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks
const MAX_RETRIES = 3;
const TIMEOUT = 15000; // 15 seconds timeout
const PROGRESS_THRESHOLDS = [25, 50, 75, 100];

export class ChunkUploadService {
  private abortController: AbortController | null = null;
  private isUploading: boolean = false;
  private lastLoggedThreshold: number = 0;
  private uploadPromises: Promise<boolean>[] = [];

  constructor(private onProgress?: (progress: number) => void) {}

  public cancel() {
    if (this.isUploading && this.abortController) {
      this.isUploading = false;
      this.abortController.abort();
      logger.debug('Upload cancelled');
    }
  }

  private shouldLogProgress(progress: number): boolean {
    const nextThreshold = PROGRESS_THRESHOLDS.find(threshold => 
      threshold > this.lastLoggedThreshold && progress >= threshold
    );
    
    if (nextThreshold) {
      this.lastLoggedThreshold = nextThreshold;
      return true;
    }
    return false;
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

      return true;
    } catch (error) {
      if (retryCount < MAX_RETRIES && this.isUploading) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff with max 5s
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.uploadChunk(url, chunk, start, total, retryCount + 1);
      }
      throw error;
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
    this.lastLoggedThreshold = 0;
    this.uploadPromises = [];

    try {
      const timestamp = Date.now();
      const uniqueFileName = `music/${timestamp}-${fileName}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${uniqueFileName}`;
      
      logger.debug('Starting upload for file:', uniqueFileName);

      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length)));
      }

      const totalChunks = chunks.length;
      let uploadedChunks = 0;

      // Parallel chunk uploads with concurrency limit
      const concurrencyLimit = 3;
      for (let i = 0; i < chunks.length; i += concurrencyLimit) {
        const chunkGroup = chunks.slice(i, i + concurrencyLimit);
        const uploadPromises = chunkGroup.map((chunk, index) => {
          const start = (i + index) * CHUNK_SIZE;
          return this.uploadChunk(bunnyUrl, chunk, start, buffer.length);
        });

        await Promise.all(uploadPromises);
        uploadedChunks += chunkGroup.length;

        const progress = Math.floor((uploadedChunks / totalChunks) * 100);
        
        if (this.shouldLogProgress(progress)) {
          logger.debug(`Upload progress: ${progress}%`);
        }

        if (this.onProgress) {
          this.onProgress(Math.min(progress, 100));
        }
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${uniqueFileName}`;
      logger.debug('File upload completed successfully:', cdnUrl);
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