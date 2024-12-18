import axios from "axios";
import { toast } from "sonner";

export class MusicController {
  static async deleteMusic(songId: string) {
    try {
      const { data } = await axios.delete(`/api/admin/songs/${songId}`);
      toast.success('Song deleted successfully');
      return data;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete song');
      throw error;
    }
  }

  static async updateSong(songId: string, updates: {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string[];
  }) {
    try {
      const { data } = await axios.put(`/api/admin/songs/${songId}`, updates);
      toast.success('Song updated successfully');
      return data;
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update song');
      throw error;
    }
  }

  static async updateGenres(songId: string, genres: string[]) {
    try {
      const { data } = await axios.put(`/api/admin/songs/${songId}`, { genre: genres });
      toast.success('Genres updated successfully');
      return data;
    } catch (error: any) {
      console.error('Update genres error:', error);
      toast.error(error.response?.data?.error || 'Failed to update genres');
      throw error;
    }
  }
}