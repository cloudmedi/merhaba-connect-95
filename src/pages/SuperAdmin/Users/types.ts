export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  license: {
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
  role?: string;
  isActive?: boolean;
  license?: {
    type: string;
    startDate: string;
    endDate: string;
  };
}