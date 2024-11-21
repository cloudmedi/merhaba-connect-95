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
  createdAt?: string;
  updatedAt?: string;
}