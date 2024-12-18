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
      toast.error('Playlist\'ler yüklenirken bir hata oluştu');
      throw error;
    }
  },

  async getPlaylistById(id: string) {
    try {
      const response = await axiosInstance.get<Playlist>(`/admin/playlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Playlist detayları yüklenirken bir hata oluştu');
      throw error;
    }
  },

  async createPlaylist(input: {
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
      const response = await axiosInstance.post<Playlist>('/admin/playlists', input);
      toast.success('Playlist başarıyla oluşturuldu');
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Playlist oluşturulurken bir hata oluştu');
      throw error;
    }
  },

  async updatePlaylist(id: string, input: {
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
      const response = await axiosInstance.put<Playlist>(`/admin/playlists/${id}`, input);
      toast.success('Playlist başarıyla güncellendi');
      return response.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Playlist güncellenirken bir hata oluştu');
      throw error;
    }
  },

  async deletePlaylist(id: string) {
    try {
      await axiosInstance.delete(`/admin/playlists/${id}`);
      toast.success('Playlist başarıyla silindi');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Playlist silinirken bir hata oluştu');
      throw error;
    }
  }
};