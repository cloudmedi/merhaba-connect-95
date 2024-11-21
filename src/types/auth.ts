export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'manager' | 'admin';
  companyId?: string;
  isActive?: boolean;
  company?: {
    id: string;
    name: string;
    subscriptionStatus?: string;
    subscriptionEndsAt?: string;
    trial_status?: 'active' | 'expired' | 'upgraded';
    trial_ends_at?: string;
  };
  license?: {
    type: 'trial' | 'premium';
    start_date: string;
    end_date: string;
    quantity: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}