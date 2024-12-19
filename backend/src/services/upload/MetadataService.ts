import NodeID3 from 'node-id3';
import { logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import crypto from 'crypto';

const metadataCache = new Cache<string, any>(60 * 60 * 1000); // 1 hour cache

export class MetadataService {
  private generateMetadataHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private validateMetadata(metadata: any): boolean {
    if (!metadata) return false;
    
    const requiredFields = ['title', 'artist', 'duration'];
    const hasRequiredFields = requiredFields.every(field => 
      metadata[field] !== undefined && metadata[field] !== null
    );

    const isValidDuration = typeof metadata.duration === 'number' && metadata.duration > 0;

    return hasRequiredFields && isValidDuration;
  }

  public async extractMetadata(buffer: Buffer, fileName: string): Promise<any> {
    try {
      const metadataHash = this.generateMetadataHash(buffer);
      const cacheKey = `metadata_${metadataHash}`;
      
      const cachedMetadata = metadataCache.get(cacheKey);
      if (cachedMetadata) {
        logger.debug('Using cached metadata for:', fileName);
        return cachedMetadata;
      }

      logger.debug('Extracting metadata for:', fileName);

      // Paralel işlemler için Promise.all kullanımı
      const [duration, id3Metadata] = await Promise.all([
        this.extractDuration(buffer, fileName),
        this.extractID3Tags(buffer)
      ]);

      const metadata = {
        title: id3Metadata?.title || fileName.replace(/\.[^/.]+$/, ""),
        artist: id3Metadata?.artist || "Unknown Artist",
        album: id3Metadata?.album || null,
        genre: id3Metadata?.genre ? [id3Metadata.genre] : [],
        duration: Math.round(duration),
        raw: id3Metadata
      };

      if (!this.validateMetadata(metadata)) {
        throw new Error('Invalid or incomplete metadata');
      }

      logger.debug('Metadata extracted successfully');
      metadataCache.set(cacheKey, metadata);
      
      return metadata;
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      throw error;
    }
  }

  private async extractDuration(buffer: Buffer, fileName: string): Promise<number> {
    const tempFilePath = join(tmpdir(), `temp-${fileName}`);
    writeFileSync(tempFilePath, buffer);

    try {
      return await getAudioDurationInSeconds(tempFilePath);
    } finally {
      try {
        unlinkSync(tempFilePath);
      } catch (error) {
        logger.error('Error cleaning up temporary file:', error);
      }
    }
  }

  private async extractID3Tags(buffer: Buffer): Promise<any> {
    return NodeID3.read(buffer);
  }
}