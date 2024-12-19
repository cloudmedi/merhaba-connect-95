import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds timeout

export class ChunkUploadService {
  private abortController: AbortController | null = null;
  private isUploading: boolean = false;

  constructor(private onProgress?: (progress: number) => void) {}

  public cancel() {
    if (this.isUploading && this.abortController) {
      this.isUploading = false;
      this.abortController.abort();
      logger.info('Upload cancelled');
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

      return true;
    } catch (error) {
      if (retryCount < MAX_RETRIES && this.isUploading) {
        logger.warn(`Retrying chunk upload (attempt ${retryCount + 1})`);
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

    try {
      const bunnyId = `music/${fileName}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${bunnyId}`;
      
      // Calculate total chunks
      const totalChunks = Math.ceil(buffer.length / CHUNK_SIZE);
      let uploadedChunks = 0;

      // Upload chunks sequentially
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
        
        if (this.onProgress) {
          const progress = Math.floor((uploadedChunks / totalChunks) * 100);
          this.onProgress(Math.min(progress, 100));
        }
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${bunnyId}`;
      logger.info('File upload completed successfully');
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