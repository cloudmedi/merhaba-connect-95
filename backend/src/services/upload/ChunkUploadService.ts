import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export class ChunkUploadService {
  private abortController: AbortController | null = null;

  constructor(private onProgress?: (progress: number) => void) {}

  public cancel() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private async uploadChunk(
    url: string, 
    chunk: Buffer, 
    start: number, 
    total: number
  ): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Content-Type': 'application/octet-stream',
          'Content-Range': `bytes ${start}-${start + chunk.length - 1}/${total}`,
        },
        body: chunk,
        signal: this.abortController?.signal
      });

      return response.ok;
    } catch (error) {
      logger.error('Chunk upload error:', error);
      throw error;
    }
  }

  public async uploadFile(buffer: Buffer, fileName: string): Promise<string> {
    this.abortController = new AbortController();
    const bunnyId = `music/${fileName}`;
    const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${bunnyId}`;
    
    try {
      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, i + CHUNK_SIZE));
      }

      for (let i = 0; i < chunks.length; i++) {
        const start = i * CHUNK_SIZE;
        await this.uploadChunk(bunnyUrl, chunks[i], start, buffer.length);
        
        if (this.onProgress) {
          const progress = ((i + 1) / chunks.length) * 100;
          this.onProgress(progress);
        }
      }

      return `https://cloud-media.b-cdn.net/${bunnyId}`;
    } catch (error) {
      logger.error('File upload error:', error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }
}