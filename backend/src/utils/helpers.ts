import crypto from 'crypto';

export const generateRandomString = (length: number): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const generateUniqueId = (): string => {
  return crypto.randomUUID();
};

export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};