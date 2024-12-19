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

        // Combine metadata and ensure all fields are properly set
        const metadata = {
          title: id3Metadata?.title || fileName.replace(/\.[^/.]+$/, ""),
          artist: id3Metadata?.artist || "Unknown Artist",
          album: id3Metadata?.album || null,
          genre: id3Metadata?.genre ? [id3Metadata.genre] : [],
          duration: Math.round(duration),
          raw: id3Metadata // Store raw metadata for debugging
        };

        logger.info('Final processed metadata:', metadata);

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
      throw error; // Hataları yukarı fırlat
    }
  }
}