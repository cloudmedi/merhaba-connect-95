import NodeID3 from 'node-id3';
import { logger } from '../../utils/logger';
import { Cache } from '../../utils/cache';

const metadataCache = new Cache<string, any>(60 * 60 * 1000); // 1 hour cache

export class MetadataService {
  public async extractMetadata(buffer: Buffer, fileName: string): Promise<any> {
    try {
      const cacheKey = `metadata_${fileName}`;
      const cachedMetadata = metadataCache.get(cacheKey);
      
      if (cachedMetadata) {
        return cachedMetadata;
      }

      const metadata = NodeID3.read(buffer);
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