import api from '@/lib/api';

export const playlistService = {
  createPlaylist: async (data: any) => {
    const response = await api.post('/admin/playlists', data);
    return response.data;
  },

  updatePlaylist: async (id: string, data: any) => {
    const response = await api.put(`/admin/playlists/${id}`, data);
    return response.data;
  },

  deletePlaylist: async (id: string) => {
    const response = await api.delete(`/admin/playlists/${id}`);
    return response.data;
  },

  getPlaylists: async () => {
    const response = await api.get('/admin/playlists');
    return response.data;
  },

  getPlaylistById: async (id: string) => {
    const response = await api.get(`/admin/playlists/${id}`);
    return response.data;
  },

  addSongsToPlaylist: async (playlistId: string, songIds: string[]) => {
    const response = await api.post(`/admin/playlists/${playlistId}/songs`, { songIds });
    return response.data;
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    const response = await api.delete(`/admin/playlists/${playlistId}/songs/${songId}`);
    return response.data;
  }
};