import { Types } from 'mongoose';

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
  status: string;
  license: {
    type: string;
    startDate: string;
    endDate: string;
  };
}

export type UserRole = 'admin' | 'manager' | 'user';

export interface UserCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  companyName?: string;
  status?: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
  companyName?: string;
  status?: string;
}

export interface LicenseUpdateInput {
  type: 'trial' | 'premium';
  startDate: Date;
  endDate: Date;
  quantity: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}