export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'admin' | 'manager' | 'user';
  companyId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string | null;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  companyId?: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}