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
    
    // Temel alanların varlığını kontrol et
    const requiredFields = ['title', 'artist', 'duration'];
    const hasRequiredFields = requiredFields.every(field => 
      metadata[field] !== undefined && metadata[field] !== null
    );

    // Süre kontrolü
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

      logger.info('Extracting metadata for:', fileName);

      const tempFilePath = join(tmpdir(), `temp-${fileName}`);
      writeFileSync(tempFilePath, buffer);

      try {
        const duration = await getAudioDurationInSeconds(tempFilePath);
        logger.debug('Duration extracted:', duration);

        const id3Metadata = NodeID3.read(buffer);
        logger.debug('ID3 metadata extracted:', id3Metadata);

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

        logger.info('Final processed metadata:', metadata);
        metadataCache.set(cacheKey, metadata);
        
        return metadata;
      } finally {
        try {
          unlinkSync(tempFilePath);
          logger.debug('Temporary file cleaned up:', tempFilePath);
        } catch (error) {
          logger.error('Error cleaning up temporary file:', error);
        }
      }
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      throw error;
    }
  }
}