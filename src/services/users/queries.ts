import { API_URL } from "../api";

export const getUsersQuery = async (filters?: {
  search?: string;
  role?: string;
  status?: string;
  license?: string;
  expiry?: string;
}) => {
  try {
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
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getUsersQuery:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};