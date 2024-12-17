import axiosInstance from '../lib/axios';
import { handleError } from '../lib/error-handler';
import type { Playlist, PlaylistCreateInput, PlaylistUpdateInput } from '../types/playlist';

export const playlistService = {
  async getPlaylists() {
    try {
      const response = await axiosInstance.get<Playlist[]>('/playlists');
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getPlaylistById(id: string) {
    try {
      const response = await axiosInstance.get<Playlist>(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async createPlaylist(data: PlaylistCreateInput) {
    try {
      const response = await axiosInstance.post<Playlist>('/playlists', data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async updatePlaylist(id: string, data: PlaylistUpdateInput) {
    try {
      const response = await axiosInstance.put<Playlist>(`/playlists/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async deletePlaylist(id: string) {
    try {
      await axiosInstance.delete(`/playlists/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};