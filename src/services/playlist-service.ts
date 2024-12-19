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
      const response = await axiosInstance.post<Playlist>('/admin/playlists', data);
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
      const response = await axiosInstance.put<Playlist>(`/admin/playlists/${id}`, data);
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