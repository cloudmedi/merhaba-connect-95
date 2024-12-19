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
    if (this.abortController) {
      this.abortController.abort();
      this.isUploading = false;
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
          'Content-Range': `bytes ${start}-${start + chunk.length - 1}/${total}`,
        },
        body: chunk,
        signal: this.abortController?.signal,
        timeout: TIMEOUT
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chunk upload failed: ${response.status} - ${errorText}`);
      }

      return true;
    } catch (error) {
      if (retryCount < MAX_RETRIES && this.isUploading) {
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

    this.isUploading = true;
    this.abortController = new AbortController();
    const bunnyId = `music/${fileName}`;
    const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${bunnyId}`;
    
    try {
      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, i + CHUNK_SIZE));
      }

      let uploadedChunks = 0;
      for (const chunk of chunks) {
        if (!this.isUploading) {
          throw new Error('Upload cancelled');
        }

        const start = uploadedChunks * CHUNK_SIZE;
        const success = await this.uploadChunk(bunnyUrl, chunk, start, buffer.length);
        
        if (!success) {
          throw new Error('Chunk upload failed');
        }
        
        uploadedChunks++;
        
        if (this.onProgress) {
          const progress = Math.floor((uploadedChunks / chunks.length) * 100);
          this.onProgress(Math.min(progress, 100));
        }
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${bunnyId}`;
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