import dotenv from 'dotenv';

dotenv.config();

export const bunnyConfig = {
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME || 'merhaba-music',
  apiKey: process.env.BUNNY_API_KEY || 'e7b1d36b-6240-4f8f-ad0d-c1d31e5439eacc1d7d05-0d11-4e30-9cd5-05a93cca3cc8',
  baseUrl: process.env.BUNNY_STORAGE_HOST || 'https://storage.bunnycdn.com'
};