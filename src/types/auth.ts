export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  isActive: boolean;
  companyId?: string;
  companyName?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  license?: {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
  } | null;
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
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  companyName?: string;
  license?: {
    type: string;
    startDate: string;
    endDate: string;
    quantity?: number;
  };
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: 'super_admin' | 'admin' | 'manager' | 'user';
  isActive?: boolean;
  companyName?: string;
}

export interface LicenseUpdateInput {
  type: string;
  startDate: string;
  endDate: string;
  quantity?: number;
}