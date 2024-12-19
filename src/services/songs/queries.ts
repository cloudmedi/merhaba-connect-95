import { API_URL } from "../api";

export const getSongsQuery = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/songs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getSongsQuery:', error);
    throw error;
  }
};