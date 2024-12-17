export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  avatar_url?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  license?: {
    startDate: string;
    endDate: string;
  };
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  password?: string;
}