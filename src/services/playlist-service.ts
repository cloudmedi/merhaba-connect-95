import axiosInstance from '../lib/axios';
import { toast } from "sonner";
import type { Playlist } from '../types/api';

export const playlistService = {
  async getPlaylists() {
    try {
      console.log('Fetching playlists...');
      const response = await axiosInstance.get<Playlist[]>('/admin/playlists');
      console.log('Playlists response:', response.data);
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
    artworkUrl?: string;
    isPublic?: boolean;
    isHero?: boolean;
    genre?: string;
    mood?: string;
    songs?: string[];
  }) {
    try {
      console.log('Creating playlist with data:', data);
      
      let artworkUrl = data.artworkUrl;
      if (data.artworkUrl && data.artworkUrl.startsWith('blob:')) {
        console.log('Uploading artwork file...');
        const formData = new FormData();
        const response = await fetch(data.artworkUrl);
        const blob = await response.blob();
        formData.append('file', blob, 'artwork.jpg');
        
        const uploadResponse = await axiosInstance.post('/admin/playlists/upload-artwork', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Artwork upload response:', uploadResponse.data);
        artworkUrl = uploadResponse.data.url;
      }

      const playlistData = {
        ...data,
        artworkUrl,
      };

      console.log('Sending playlist data:', playlistData);
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
    artworkUrl?: string;
    isPublic?: boolean;
    isHero?: boolean;
    genre?: string;
    mood?: string;
    songs?: string[];
  }) {
    try {
      console.log('Updating playlist:', id);
      console.log('Update data:', data);
      
      let artworkUrl = data.artworkUrl;
      if (data.artworkUrl && data.artworkUrl.startsWith('blob:')) {
        console.log('Uploading new artwork file...');
        const formData = new FormData();
        const response = await fetch(data.artworkUrl);
        const blob = await response.blob();
        formData.append('file', blob, 'artwork.jpg');
        
        const uploadResponse = await axiosInstance.post('/admin/playlists/upload-artwork', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Artwork upload response:', uploadResponse.data);
        artworkUrl = uploadResponse.data.url;
      }

      const playlistData = {
        ...data,
        artworkUrl,
      };

      console.log('Sending update request to:', `/admin/playlists/${id}`);
      console.log('Update payload:', playlistData);
      
      const response = await axiosInstance.put<Playlist>(`/admin/playlists/${id}`, playlistData);
      console.log('Update response:', response.data);
      
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