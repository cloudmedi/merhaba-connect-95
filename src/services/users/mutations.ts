import { UserCreateInput } from "@/types/user";
import axios from '@/lib/axios';

export const createUser = async (userData: UserCreateInput) => {
  try {
    const response = await axios.post('/admin/users', userData);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Error creating user');
  }
};

export const updateUser = async (id: string, updates: any) => {
  try {
    const response = await axios.put(`/admin/users/${id}`, updates);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Error updating user');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`/admin/users/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error deleting user');
  }
};

export const toggleUserStatus = async (id: string, isActive: boolean) => {
  return updateUser(id, { isActive });
};

export const renewLicense = async (userId: string, licenseData: any) => {
  try {
    const response = await axios.put(`/admin/users/${userId}/license`, licenseData);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to renew license');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Error renewing license');
  }
};