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
  company?: {
    id: string;
    name: string;
    subscriptionStatus: string;
    subscriptionEndsAt: string | null;
  };
  license?: {
    type: string;
    startDate: string;
    endDate: string | null;
    quantity: number;
  };
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: "admin" | "manager";
  license: {
    type: "trial" | "premium";
    startDate: string;
    endDate: string;
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