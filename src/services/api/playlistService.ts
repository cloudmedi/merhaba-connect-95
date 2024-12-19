import axios from '@/lib/axios';
import type { IPlaylist, PlaylistCreateInput, PlaylistUpdateInput } from '../../../backend/src/types/playlist';

export const playlistService = {
  getAllPlaylists: async () => {
    const response = await axios.get<IPlaylist[]>('/playlists');
    return response.data;
  },

  getPlaylistById: async (id: string) => {
    const response = await axios.get<IPlaylist>(`/playlists/${id}`);
    return response.data;
  },

  createPlaylist: async (data: PlaylistCreateInput) => {
    const response = await axios.post<IPlaylist>('/playlists', data);
    return response.data;
  },

  updatePlaylist: async (id: string, data: PlaylistUpdateInput) => {
    const response = await axios.put<IPlaylist>(`/playlists/${id}`, data);
    return response.data;
  },

  deletePlaylist: async (id: string) => {
    await axios.delete(`/playlists/${id}`);
  }
};