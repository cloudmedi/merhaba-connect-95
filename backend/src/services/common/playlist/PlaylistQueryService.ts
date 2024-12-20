import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';
import { Types } from 'mongoose';

export class PlaylistQueryService extends BasePlaylistService {
  async getAllPlaylists() {
    try {
      console.log('Fetching all playlists with managers...');
      
      const playlists = await Playlist.find()
        .populate({
          path: 'songs.songId',
          select: 'title artist album duration fileUrl artworkUrl'
        })
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: '_id email firstName lastName'
        })
        .sort({ createdAt: -1 });

      console.log(`Found ${playlists.length} total playlists`);
      return playlists;
    } catch (error) {
      console.error('Error fetching playlists with managers:', error);
      throw error;
    }
  }

  async getManagerPlaylists(managerId: string) {
    try {
      if (!managerId) {
        throw new Error('Manager ID is required');
      }

      console.log('Fetching playlists for manager:', managerId);
      
      const playlists = await Playlist.find({
        $or: [
          { 'assignedManagers._id': new Types.ObjectId(managerId) },
          { isPublic: true }
        ]
      })
        .populate({
          path: 'songs.songId',
          select: 'title artist album duration fileUrl artworkUrl'
        })
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .sort({ createdAt: -1 });

      console.log(`Found ${playlists.length} playlists for manager`);
      return playlists;
    } catch (error) {
      console.error('Error fetching manager playlists:', error);
      throw error;
    }
  }

  async getPlaylistSongs(playlistId: string) {
    try {
      console.log('Fetching songs for playlist:', playlistId);
      const playlist = await Playlist.findById(playlistId)
        .populate({
          path: 'songs.songId',
          select: 'title artist album duration fileUrl artworkUrl'
        });
      
      console.log(`Found ${playlist?.songs?.length || 0} songs for playlist`);
      return playlist?.songs || [];
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
      throw error;
    }
  }

  async getPlaylistCategories(playlistId: string) {
    try {
      console.log('Fetching categories for playlist:', playlistId);
      const playlist = await Playlist.findById(playlistId)
        .populate('categories');
      
      console.log(`Found ${playlist?.categories?.length || 0} categories for playlist`);
      return playlist?.categories || [];
    } catch (error) {
      console.error('Error fetching playlist categories:', error);
      throw error;
    }
  }
}