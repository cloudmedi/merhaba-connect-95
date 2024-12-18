import dotenv from 'dotenv';

dotenv.config();

export const bunnyConfig = {
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME || 'merhaba-connect',
  apiKey: process.env.BUNNY_API_KEY || 'your-secret-key',
  baseUrl: process.env.BUNNY_STORAGE_HOST || 'https://storage.bunnycdn.com'
};