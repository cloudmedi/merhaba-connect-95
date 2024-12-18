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
      logger.info('Starting metadata extraction for file:', fileName);
      
      const cacheKey = `metadata_${fileName}`;
      const cachedMetadata = metadataCache.get(cacheKey);
      
      if (cachedMetadata) {
        logger.info('Returning cached metadata for file:', fileName);
        return cachedMetadata;
      }

      // Geçici dosya oluştur
      const tempFilePath = join(tmpdir(), `temp-${fileName}`);
      logger.info('Creating temporary file at:', tempFilePath);
      
      writeFileSync(tempFilePath, buffer);
      logger.info('Temporary file created successfully');

      try {
        // Geçici dosyadan süreyi al
        logger.info('Attempting to get audio duration');
        const duration = await getAudioDurationInSeconds(tempFilePath);
        logger.info('Raw duration value:', duration);

        // Get other metadata using NodeID3
        logger.info('Attempting to read ID3 metadata');
        const id3Metadata = NodeID3.read(buffer);
        logger.info('Raw ID3 metadata:', id3Metadata);

        // Combine metadata
        const metadata = {
          ...id3Metadata,
          duration: Math.round(duration) // Round to nearest second
        };

        logger.info('Combined metadata:', metadata);
        logger.info('Final duration value:', metadata.duration);

        if (metadata) {
          metadataCache.set(cacheKey, metadata);
          logger.info('Metadata cached successfully');
        }
        
        return metadata;
      } finally {
        // Geçici dosyayı temizle
        try {
          unlinkSync(tempFilePath);
          logger.info('Temporary file cleaned up successfully');
        } catch (error) {
          logger.error('Error cleaning up temporary file:', error);
        }
      }
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      logger.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      return null;
    }
  }
}