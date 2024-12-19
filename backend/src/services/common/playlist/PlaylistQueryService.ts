import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

export class PlaylistQueryService extends BasePlaylistService {
  async getAllPlaylists() {
    try {
      console.log('Fetching all playlists with populated fields...');
      const playlists = await Playlist.find()
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: '-password' // Güvenlik için password alanını hariç tutuyoruz
        })
        .sort({ createdAt: -1 });

      console.log(`Found ${playlists.length} playlists`);
      return playlists;
    } catch (error) {
      console.error('Error in getAllPlaylists:', error);
      throw error;
    }
  }

  async getPlaylistSongs(playlistId: string) {
    try {
      console.log(`Fetching songs for playlist: ${playlistId}`);
      const playlist = await Playlist.findById(playlistId).populate('songs.songId');
      return playlist?.songs || [];
    } catch (error) {
      console.error('Error in getPlaylistSongs:', error);
      throw error;
    }
  }

  async getPlaylistCategories(playlistId: string) {
    try {
      console.log(`Fetching categories for playlist: ${playlistId}`);
      const playlist = await Playlist.findById(playlistId).populate('categories');
      return playlist?.categories || [];
    } catch (error) {
      console.error('Error in getPlaylistCategories:', error);
      throw error;
    }
  }

  async getPlaylistById(playlistId: string) {
    try {
      console.log(`Fetching playlist by ID: ${playlistId}`);
      const playlist = await Playlist.findById(playlistId)
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: '-password'
        });

      if (!playlist) {
        console.log(`No playlist found with ID: ${playlistId}`);
        return null;
      }

      console.log('Playlist found with populated fields:', {
        id: playlist._id,
        name: playlist.name,
        managersCount: playlist.assignedManagers?.length || 0
      });

      return playlist;
    } catch (error) {
      console.error('Error in getPlaylistById:', error);
      throw error;
    }
  }
}