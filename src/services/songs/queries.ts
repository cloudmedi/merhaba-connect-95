import { API_URL } from "../api";
import { Song } from "@/types/playlist";

export const getSongsQuery = async (): Promise<Song[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/songs`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch songs:', response.status, response.statusText);
    throw new Error('Failed to fetch songs');
  }

  return response.json();
};