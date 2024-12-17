export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user';

export interface UserCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  companyName?: string;
  license?: {
    type: 'trial' | 'premium';
    start_date?: string;
    end_date?: string;
    quantity?: number;
  };
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
  companyName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}