export type UserRole = 'super_admin' | 'manager';

export interface Company {
  id: string;
  name: string;
  subscriptionStatus?: string;
  subscriptionEndsAt?: string | null;
}

export interface License {
  type: 'trial' | 'premium';
  start_date: string;
  end_date: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar_url: string | null;
  companyId?: string;
  company?: Company;
  license?: License;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}