import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds timeout
const PROGRESS_THRESHOLDS = [25, 50, 75, 100]; // İlerleme eşikleri

export class ChunkUploadService {
  private abortController: AbortController | null = null;
  private isUploading: boolean = false;
  private lastLoggedThreshold: number = 0;

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
        logger.debug(`Retrying chunk upload (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
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

    if (!fileName) {
      throw new Error('Invalid filename provided');
    }

    this.isUploading = true;
    this.abortController = new AbortController();
    this.lastLoggedThreshold = 0;

    try {
      const timestamp = Date.now();
      const uniqueFileName = `music/${timestamp}-${fileName}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${uniqueFileName}`;
      
      logger.info(`Starting upload for file: ${uniqueFileName}`);

      const totalChunks = Math.ceil(buffer.length / CHUNK_SIZE);
      let uploadedChunks = 0;

      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        if (!this.isUploading) {
          throw new Error('Upload cancelled');
        }

        const chunk = buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length));
        const success = await this.uploadChunk(bunnyUrl, chunk, i, buffer.length);
        
        if (!success) {
          throw new Error('Chunk upload failed');
        }

        uploadedChunks++;
        const progress = Math.floor((uploadedChunks / totalChunks) * 100);
        
        if (this.shouldLogProgress(progress)) {
          logger.debug(`Upload progress: ${progress}%`);
        }

        if (this.onProgress) {
          this.onProgress(Math.min(progress, 100));
        }
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${uniqueFileName}`;
      logger.info('File upload completed successfully:', cdnUrl);
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