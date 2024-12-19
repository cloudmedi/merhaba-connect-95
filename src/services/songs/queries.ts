import axiosInstance from '@/lib/axios';
import { Song } from "@/types/playlist";

export const getSongsQuery = async (): Promise<Song[]> => {
  console.log('Fetching songs using axios instance...');
  
  try {
    const response = await axiosInstance.get('/admin/songs');
    console.log('Songs response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};