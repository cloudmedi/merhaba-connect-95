export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  password: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: 'super_admin' | 'admin' | 'manager' | 'user';
  isActive?: boolean;
}