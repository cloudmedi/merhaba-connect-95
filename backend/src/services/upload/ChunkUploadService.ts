import { Readable } from 'stream';
import fetch from 'node-fetch';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds timeout

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
    total: number,
    retryCount = 0
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
        signal: this.abortController?.signal,
        timeout: TIMEOUT
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chunk upload failed: ${response.status} - ${errorText}`);
      }

      logger.info(`Chunk uploaded successfully: start=${start}`);
      return true;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        logger.warn(`Retrying chunk upload (attempt ${retryCount + 1}): start=${start}`);
        return this.uploadChunk(url, chunk, start, total, retryCount + 1);
      }
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

      let uploadedChunks = 0;
      for (const chunk of chunks) {
        const start = uploadedChunks * CHUNK_SIZE;
        const success = await this.uploadChunk(bunnyUrl, chunk, start, buffer.length);
        
        if (!success) {
          throw new Error('Chunk upload failed');
        }
        
        uploadedChunks++;
        
        if (this.onProgress) {
          const progress = (uploadedChunks / chunks.length) * 100;
          this.onProgress(Math.min(progress, 100));
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