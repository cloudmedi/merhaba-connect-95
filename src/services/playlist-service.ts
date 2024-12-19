import axiosInstance from '../lib/axios';
import { toast } from "sonner";
import type { Playlist } from '../types/api';

export const playlistService = {
  async getPlaylists() {
    try {
      const response = await axiosInstance.get<Playlist[]>('/admin/playlists');
      return response.data;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
      throw error;
    }
  },

  async createPlaylist(data: {
    name: string;
    description?: string;
    artwork_url?: string;
    is_public?: boolean;
    is_hero?: boolean;
    genre_id?: string;
    mood_id?: string;
    songs?: string[];
  }) {
    try {
      // Handle artwork upload if it's a blob URL
      let artwork_url = data.artwork_url;
      if (data.artwork_url && data.artwork_url.startsWith('blob:')) {
        const formData = new FormData();
        const response = await fetch(data.artwork_url);
        const blob = await response.blob();
        formData.append('file', blob, 'artwork.jpg');
        
        // Using the correct endpoint for artwork upload
        const uploadResponse = await axiosInstance.post('/admin/playlists/upload-artwork', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        artwork_url = uploadResponse.data.url;
      }

      const playlistData = {
        ...data,
        artwork_url,
      };

      const response = await axiosInstance.post<Playlist>('/admin/playlists', playlistData);
      toast.success('Playlist created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
      throw error;
    }
  },

  async updatePlaylist(id: string, data: {
    name?: string;
    description?: string;
    artwork_url?: string;
    is_public?: boolean;
    is_hero?: boolean;
    genre_id?: string;
    mood_id?: string;
    songs?: string[];
  }) {
    try {
      let artwork_url = data.artwork_url;
      if (data.artwork_url && data.artwork_url.startsWith('blob:')) {
        const formData = new FormData();
        const response = await fetch(data.artwork_url);
        const blob = await response.blob();
        formData.append('file', blob, 'artwork.jpg');
        
        const uploadResponse = await axiosInstance.post('/admin/upload-artwork', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        artwork_url = uploadResponse.data.url;
      }

      const playlistData = {
        ...data,
        artwork_url,
      };

      const response = await axiosInstance.put<Playlist>(`/admin/playlists/${id}`, playlistData);
      toast.success('Playlist updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist');
      throw error;
    }
  },

  async deletePlaylist(id: string) {
    try {
      await axiosInstance.delete(`/admin/playlists/${id}`);
      toast.success('Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
      throw error;
    }
  }
};