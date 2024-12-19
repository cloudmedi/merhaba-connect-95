import NodeID3 from 'node-id3';
import { logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const metadataCache = new Cache<string, any>(60 * 60 * 1000); // 1 hour cache

export class MetadataService {
  public async extractMetadata(buffer: Buffer, fileName: string): Promise<any> {
    try {
      const cacheKey = `metadata_${fileName}`;
      const cachedMetadata = metadataCache.get(cacheKey);
      
      if (cachedMetadata) {
        logger.info('Using cached metadata for:', fileName);
        return cachedMetadata;
      }

      logger.info('Extracting metadata for:', fileName);

      // Geçici dosya oluştur
      const tempFilePath = join(tmpdir(), `temp-${fileName}`);
      writeFileSync(tempFilePath, buffer);

      try {
        // Geçici dosyadan süreyi al
        const duration = await getAudioDurationInSeconds(tempFilePath);
        logger.info('Duration extracted:', duration);

        // Get other metadata using NodeID3
        const id3Metadata = NodeID3.read(buffer);
        logger.info('ID3 metadata extracted:', id3Metadata);

        // Combine metadata
        const metadata = {
          ...id3Metadata,
          duration: Math.round(duration) // Round to nearest second
        };

        if (metadata) {
          metadataCache.set(cacheKey, metadata);
          logger.info('Metadata cached for:', fileName);
        }
        
        return metadata;
      } finally {
        // Geçici dosyayı temizle
        try {
          unlinkSync(tempFilePath);
          logger.info('Temporary file cleaned up:', tempFilePath);
        } catch (error) {
          logger.error('Error cleaning up temporary file:', error);
        }
      }
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      return null;
    }
  }
}