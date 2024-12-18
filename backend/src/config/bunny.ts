import dotenv from 'dotenv';

dotenv.config();

export const bunnyConfig = {
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
  apiKey: process.env.BUNNY_API_KEY,
  baseUrl: process.env.BUNNY_STORAGE_HOST
};