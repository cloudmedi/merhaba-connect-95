import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

export const bunnyConfig = {
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME || '',
  apiKey: process.env.BUNNY_API_KEY || '',
  baseUrl: process.env.BUNNY_STORAGE_HOST || ''
};

// Validate config
if (!bunnyConfig.apiKey) {
  logger.error('BUNNY_API_KEY is not set in environment variables');
  throw new Error('BUNNY_API_KEY is required');
}

if (!bunnyConfig.storageZoneName) {
  logger.error('BUNNY_STORAGE_ZONE_NAME is not set in environment variables');
  throw new Error('BUNNY_STORAGE_ZONE_NAME is required');
}

if (!bunnyConfig.baseUrl) {
  logger.error('BUNNY_STORAGE_HOST is not set in environment variables');
  throw new Error('BUNNY_STORAGE_HOST is required');
}

export default bunnyConfig;