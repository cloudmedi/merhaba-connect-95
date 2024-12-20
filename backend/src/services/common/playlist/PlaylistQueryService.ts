import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';
import { Types } from 'mongoose';

export class PlaylistQueryService extends BasePlaylistService {
  async getAllPlaylists() {
    try {
      console.log('Fetching all playlists with managers...');
      
      const playlists = await Playlist.find()
        .populate({
          path: 'assignedManagers',
          select: 'email firstName lastName',
          model: 'User'
        })
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .sort({ createdAt: -1 });

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
      
      // Manager'a atanmış playlistleri getir
      const playlists = await Playlist.find({
        'assignedManagers._id': new Types.ObjectId(managerId)
      })
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .sort({ createdAt: -1 });

      return playlists;
    } catch (error) {
      console.error('Error fetching manager playlists:', error);
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