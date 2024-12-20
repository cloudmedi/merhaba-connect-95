export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'user';
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'user';
  isActive?: boolean;
}

export interface LicenseUpdateInput {
  type: 'trial' | 'premium';
  startDate: Date;
  endDate: Date;
  quantity: number;
}