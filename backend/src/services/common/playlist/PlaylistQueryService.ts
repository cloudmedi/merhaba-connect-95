import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

export class PlaylistQueryService extends BasePlaylistService {
  async getAllPlaylists() {
    try {
      return await Playlist.find()
        .populate({
          path: 'assignedManagers',
          select: 'email firstName lastName'  // Sadece ihtiyacımız olan alanları seçiyoruz
        })
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching playlists with managers:', error);
      throw error;
    }
  }

  async getPlaylistSongs(playlistId: string) {
    try {
      const playlist = await Playlist.findById(playlistId).populate('songs.songId');
      return playlist?.songs || [];
    } catch (error) {
      throw error;
    }
  }

  async getPlaylistCategories(playlistId: string) {
    try {
      const playlist = await Playlist.findById(playlistId).populate('categories');
      return playlist?.categories || [];
    } catch (error) {
      throw error;
    }
  }
}