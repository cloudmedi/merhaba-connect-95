export const FILE_UPLOAD_LIMITS = {
  maxFileSize: 20 * 1024 * 1024, // 20MB
  allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  maxConcurrentUploads: 5
};

export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error'
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully'
} as const;