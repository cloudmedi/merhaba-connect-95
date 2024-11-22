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
  avatarUrl?: string | null;  // Added this line
  company?: {
    id: string;
    name: string;
    subscriptionStatus: string;
    subscriptionEndsAt: string | null;
  };
  license?: {
    type: string;
    start_date: string;
    end_date: string | null;
    quantity: number;
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