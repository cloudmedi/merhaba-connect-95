export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  companyId?: string;
  company?: {
    id: string;
    name: string;
    subscriptionStatus?: string;
    subscriptionEndsAt?: string | null;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string | null;
  license?: {
    id: string;
    type: string;
    startDate: string;
    endDate: string | null;
  };
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'manager' | 'user';
  companyName?: string;
  license?: {
    type: 'trial' | 'premium';
    start_date: string;
    end_date: string;
    quantity: number;
  };
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'user';
  isActive?: boolean;
  password?: string;
  companyId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LicenseUpdateInput {
  type: string;
  endDate: string;
}
