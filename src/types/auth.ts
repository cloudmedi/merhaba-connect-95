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
    start_date: string;
    end_date: string | null;
    quantity: number;
  };
}
