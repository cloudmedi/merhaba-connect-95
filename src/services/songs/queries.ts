import { API_URL } from "../api";
import { Song } from "@/types/playlist";

export const getSongsQuery = async (): Promise<Song[]> => {
  console.log('Fetching songs...');
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  // Token varsa veya yoksa her durumda Authorization header'ı ekle
  headers.Authorization = `Bearer ${token || ''}`;
  
  console.log('Request headers:', headers);

  const response = await fetch(`${API_URL}/admin/songs`, {
    headers: headers
  });

  if (!response.ok) {
    console.error('Failed to fetch songs:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    throw new Error('Failed to fetch songs');
  }

  return response.json();
};