export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  license?: {
    type: string;
    expiresAt: string;
  };
  createdAt: string;
  updatedAt: string;
}