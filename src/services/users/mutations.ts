import { User, UserCreateInput, UserUpdateInput } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const createUser = async (userData: UserCreateInput): Promise<User> => {
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
};

export const updateUser = async (id: string, updates: UserUpdateInput & { companyId?: string }): Promise<User> => {
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
};

export const deleteUser = async (id: string): Promise<void> => {
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
};

export const toggleUserStatus = async (id: string, isActive: boolean): Promise<User> => {
  return updateUser(id, { isActive });
};

export const renewLicense = async (userId: string, licenseData: { type: string; endDate: string }): Promise<User> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/users/${userId}/license`, {
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
};