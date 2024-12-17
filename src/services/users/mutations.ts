import { UserCreateInput } from "@/types/user";
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

export const updateUserLicense = async (userId: string, licenseData: any) => {
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
      throw new Error(error.message || 'Failed to update license');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Error updating license');
  }
};