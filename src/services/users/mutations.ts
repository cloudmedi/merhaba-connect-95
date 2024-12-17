import { UserCreateInput } from "@/types/auth";
import { API_URL } from "../api";

export const createUser = async (userData: UserCreateInput) => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData),
    });

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
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updates),
    });

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
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

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
    const response = await fetch(`${API_URL}/admin/users/${userId}/license`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(licenseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to renew license');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Error renewing license');
  }
};