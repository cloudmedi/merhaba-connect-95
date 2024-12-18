import dotenv from 'dotenv';

dotenv.config();

export const bunnyConfig = {
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME || '',
  apiKey: process.env.BUNNY_API_KEY || '',
  baseUrl: process.env.BUNNY_STORAGE_HOST || ''
};

// Validate config
if (!bunnyConfig.apiKey) {
  console.error('BUNNY_API_KEY is not set in environment variables');
}

if (!bunnyConfig.storageZoneName) {
  console.error('BUNNY_STORAGE_ZONE_NAME is not set in environment variables');
}

if (!bunnyConfig.baseUrl) {
  console.error('BUNNY_STORAGE_HOST is not set in environment variables');
}