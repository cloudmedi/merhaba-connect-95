export type UserRole = 'super_admin' | 'manager';

export interface Company {
  id: string;
  name: string;
  subscription_status?: string;
  subscription_ends_at?: string | null;
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
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  company_id?: string;
  company?: Company;
  license?: License;

  // Aliases for frontend compatibility
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
}