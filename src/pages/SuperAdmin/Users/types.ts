export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  license?: {
    endDate: string;
    startDate: string;
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