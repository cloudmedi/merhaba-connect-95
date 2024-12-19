import { UserCreateInput } from "@/types/user";
import axios from '@/lib/axios';

export const createUser = async (userData: UserCreateInput) => {
  try {
    const response = await axios.post('/admin/users', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating user');
  }
};

export const updateUser = async (id: string, updates: any) => {
  try {
    const response = await axios.put(`/admin/users/${id}`, updates);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error updating user');
  }
};

export const deleteUser = async (id: string) => {
  try {
    await axios.delete(`/admin/users/${id}`);
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
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error renewing license');
  }
};