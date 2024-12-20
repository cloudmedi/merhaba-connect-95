export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  license?: {
    type: string;
    expiresAt: string;
    status: string;
  };
}