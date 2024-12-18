import NodeID3 from 'node-id3';
import { logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';
import { getAudioDurationInSeconds } from 'get-audio-duration';

const metadataCache = new Cache<string, any>(60 * 60 * 1000); // 1 hour cache

export class MetadataService {
  public async extractMetadata(buffer: Buffer, fileName: string): Promise<any> {
    try {
      const cacheKey = `metadata_${fileName}`;
      const cachedMetadata = metadataCache.get(cacheKey);
      
      if (cachedMetadata) {
        return cachedMetadata;
      }

      // Create a temporary Blob from the buffer
      const blob = new Blob([buffer], { type: 'audio/mpeg' });

      // Get duration using get-audio-duration
      const duration = await getAudioDurationInSeconds(blob);

      // Get other metadata using NodeID3
      const id3Metadata = NodeID3.read(buffer);

      // Combine metadata
      const metadata = {
        ...id3Metadata,
        duration: Math.round(duration) // Round to nearest second
      };

      if (metadata) {
        metadataCache.set(cacheKey, metadata);
      }
      
      return metadata;
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      return null;
    }
  }
}