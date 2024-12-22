import api from '@/lib/api';
import { User, UserCreateInput, UserUpdateInput, LicenseUpdateInput } from '@/types/auth';

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(userData: UserCreateInput): Promise<User> {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: UserUpdateInput): Promise<User> {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    const response = await api.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  async updateLicense(id: string, licenseData: LicenseUpdateInput): Promise<void> {
    await api.put(`/admin/users/${id}/license`, licenseData);
  },

  async renewLicense(id: string, licenseData: LicenseUpdateInput): Promise<void> {
    await api.post(`/admin/users/${id}/license/renew`, licenseData);
  }
};