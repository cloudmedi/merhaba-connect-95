export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  license?: {
    type: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  status?: string;
}