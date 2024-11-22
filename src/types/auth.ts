export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'super_admin' | 'manager' | 'admin';
  companyId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar_url?: string | null;
  company?: {
    id: string;
    name: string;
    subscription_status: string;
    subscription_ends_at: string | null;
    trial_status?: string;
    trial_ends_at?: string | null;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}