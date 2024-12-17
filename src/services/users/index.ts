import { getUsersQuery, getUserById } from './queries';
import { createUser, updateUser, deleteUser, toggleUserStatus, renewLicense } from './mutations';
import { User, UserCreateInput, UserUpdateInput, LicenseUpdateInput } from '@/types/auth';

export const userService = {
  getUsers: async (filters?: {
    search?: string;
    role?: string;
    status?: string;
    license?: string;
    expiry?: string;
  }) => {
    const data = await getUsersQuery(filters);
    return data;
  },
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  renewLicense: async (userId: string, licenseData: LicenseUpdateInput) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/license`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(licenseData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to renew license');
    }

    return response.json();
  }
};