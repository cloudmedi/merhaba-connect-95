import { User, UserCreateInput, UserUpdateInput, LicenseUpdateInput } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
  }): Promise<User[]> {
    const token = localStorage.getItem('token');
    let url = `${API_URL}/admin/users`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async getUserById(id: string): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  async createUser(userData: UserCreateInput): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return response.json();
  },

  async updateUser(id: string, updates: UserUpdateInput): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    return this.updateUser(id, { isActive });
  },

  async renewLicense(id: string, licenseData: LicenseUpdateInput): Promise<User> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/${id}/license`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(licenseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to renew license');
    }

    return response.json();
  }
};