import fetch from 'node-fetch';
import { bunnyConfig } from '../config/bunny';
import { logger } from './logger';

export const validateBunnyCredentials = async () => {
  try {
    // Test URL oluştur - storage zone root'unu kontrol et
    const testUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/`;
    
    logger.info('Validating Bunny CDN credentials...');
    logger.info(`Testing connection to: ${testUrl}`);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'AccessKey': bunnyConfig.apiKey,
        'Accept': '*/*'
      }
    });

    if (response.ok) {
      logger.info('✅ Bunny CDN credentials are valid!');
      logger.info('Storage Zone is accessible');
      return true;
    } else {
      logger.error('❌ Bunny CDN validation failed:', await response.text());
      logger.error('Status:', response.status);
      return false;
    }
  } catch (error) {
    logger.error('❌ Bunny CDN validation error:', error);
    return false;
  }
};