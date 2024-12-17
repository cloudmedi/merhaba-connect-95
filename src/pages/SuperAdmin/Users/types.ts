export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  isActive: boolean;
  license?: {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: 'super_admin' | 'admin' | 'manager' | 'user';
  isActive?: boolean;
  license?: {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
  };
}