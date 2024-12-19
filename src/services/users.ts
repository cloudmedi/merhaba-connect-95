import apiClient from '@/lib/apiClient';
import { User, UserCreateInput, UserUpdateInput, LicenseUpdateInput } from '@/types/auth';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  async createUser(userData: UserCreateInput): Promise<User> {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: UserUpdateInput): Promise<User> {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  async updateLicense(id: string, licenseData: LicenseUpdateInput): Promise<void> {
    await apiClient.put(`/admin/users/${id}/license`, licenseData);
  }
};