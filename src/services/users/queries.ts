import axios from '@/lib/axios';

export const getUsersQuery = async (filters?: {
  search?: string;
  role?: string;
  status?: string;
  license?: string;
  expiry?: string;
}) => {
  try {
    let url = '/admin/users';

    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error in getUsersQuery:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};