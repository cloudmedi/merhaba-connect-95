import NodeID3 from 'node-id3';
import { logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const metadataCache = new Cache<string, any>(60 * 60 * 1000); // 1 hour cache

export class MetadataService {
  public async extractMetadata(buffer: Buffer, fileName: string): Promise<any> {
    const startTime = Date.now();
    logger.info(`Starting metadata extraction for file: ${fileName}`);

    try {
      // Check cache first
      const cacheKey = `metadata_${fileName}`;
      const cachedMetadata = metadataCache.get(cacheKey);
      
      if (cachedMetadata) {
        logger.info(`Returning cached metadata for ${fileName}`);
        return cachedMetadata;
      }

      // Create unique temp file path
      const tempFileName = `temp-${Date.now()}-${fileName}`;
      const tempFilePath = join(tmpdir(), tempFileName);
      
      logger.info(`Writing temp file to: ${tempFilePath}`);
      await writeFile(tempFilePath, buffer);

      try {
        // Extract duration with timeout
        const durationPromise = getAudioDurationInSeconds(tempFilePath);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Duration extraction timed out')), 10000);
        });

        const extractedDuration = await Promise.race([durationPromise, timeoutPromise]);
        
        // Type guard to ensure duration is a number
        const duration = typeof extractedDuration === 'number' ? extractedDuration : null;
        logger.info(`Duration extracted successfully: ${duration} seconds`);

        // Get ID3 metadata
        const id3Metadata = NodeID3.read(buffer);
        logger.info('ID3 metadata extracted:', id3Metadata);

        // Combine metadata with proper type checking for duration
        const metadata = {
          ...id3Metadata,
          duration: duration !== null ? Math.round(duration) : null // Only round if duration is a number
        };

        logger.info('Final metadata object:', metadata);

        // Cache the result
        if (metadata) {
          metadataCache.set(cacheKey, metadata);
        }

        const processingTime = Date.now() - startTime;
        logger.info(`Metadata extraction completed in ${processingTime}ms`);
        
        return metadata;

      } finally {
        // Cleanup temp file
        try {
          await unlink(tempFilePath);
          logger.info(`Temporary file cleaned up: ${tempFilePath}`);
        } catch (error) {
          logger.error('Error cleaning up temporary file:', error);
        }
      }
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      
      // Return basic metadata in case of error
      const basicMetadata = {
        title: fileName.replace(/\.[^/.]+$/, ""),
        duration: null,
        artist: null,
        album: null
      };
      
      logger.info('Returning basic metadata due to error:', basicMetadata);
      return basicMetadata;
    }
  }
}