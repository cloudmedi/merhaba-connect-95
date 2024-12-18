import fetch from 'node-fetch';
import { bunnyConfig } from '../config/bunny';
import { logger } from './logger';

export const validateBunnyCredentials = async () => {
  try {
    // Test URL oluştur
    const testUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/`;
    
    logger.info('Validating Bunny CDN credentials...');
    logger.info(`Testing connection to: ${testUrl}`);
    logger.info(`Using API Key: ${bunnyConfig.apiKey.substring(0, 8)}...`);
    logger.info(`Storage Zone Name: ${bunnyConfig.storageZoneName}`);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'AccessKey': bunnyConfig.apiKey,
        'Accept': '*/*'
      }
    });

    const responseText = await response.text();
    
    if (response.ok) {
      logger.info('✅ Bunny CDN credentials are valid!');
      logger.info('Storage Zone is accessible');
      return true;
    } else {
      logger.error('❌ Bunny CDN validation failed:');
      logger.error(`Status Code: ${response.status}`);
      logger.error(`Response: ${responseText}`);
      logger.error(`Headers: ${JSON.stringify(response.headers.raw())}`);
      return false;
    }
  } catch (error) {
    logger.error('❌ Bunny CDN validation error:', error);
    return false;
  }
};