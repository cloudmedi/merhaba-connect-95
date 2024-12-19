import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

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
      logger.info(`Uploading chunk: start=${start}, size=${chunk.length}, total=${total}`);
      
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

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Chunk upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Chunk upload failed: ${response.status} - ${errorText}`);
      }

      logger.info(`Chunk uploaded successfully: start=${start}`);
      return true;
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
      logger.info(`Starting file upload: ${fileName}, size: ${buffer.length} bytes`);
      
      const chunks: Buffer[] = [];
      for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
        chunks.push(buffer.slice(i, i + CHUNK_SIZE));
      }

      logger.info(`File split into ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const start = i * CHUNK_SIZE;
        const success = await this.uploadChunk(bunnyUrl, chunks[i], start, buffer.length);
        
        if (!success) {
          throw new Error('Chunk upload failed');
        }
        
        if (this.onProgress) {
          const progress = ((i + 1) / chunks.length) * 100;
          this.onProgress(progress);
        }
      }

      const cdnUrl = `https://cloud-media.b-cdn.net/${bunnyId}`;
      logger.info(`File upload completed: ${cdnUrl}`);

      return cdnUrl;
    } catch (error) {
      logger.error('File upload error:', error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }
}