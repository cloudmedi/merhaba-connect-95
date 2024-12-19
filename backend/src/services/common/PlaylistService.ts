import { Playlist } from '../../models/common/Playlist';
import { WebSocketService } from './WebSocketService';
import { Types } from 'mongoose';

export class PlaylistService {
  private wsService: WebSocketService;

  constructor(io: any) {
    this.wsService = new WebSocketService(io);
  }

  async createPlaylist(data: {
    name: string;
    description?: string;
    isPublic?: boolean;
    isHero?: boolean;
    createdBy: string;
    songs?: Array<{ songId: string; position: number }>;
    categories?: string[];
    genre?: string;
    mood?: string;
    artworkUrl?: string;
    assignedManagers?: string[];
  }) {
    try {
      const playlist = new Playlist(data);
      await playlist.save();
      
      // Emit real-time update
      this.wsService.emitPlaylistUpdate(playlist.id, {
        action: 'created',
        playlist
      });
      
      return playlist;
    } catch (error) {
      throw error;
    }
  }

  async getAllPlaylists() {
    try {
      return await Playlist.find()
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate('assignedManagers')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlaylist(id: string, data: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    isHero?: boolean;
    songs?: Array<{ songId: string; position: number }>;
    categories?: string[];
    genre?: string;
    mood?: string;
    artworkUrl?: string;
    assignedManagers?: string[];
  }) {
    try {
      const playlist = await Playlist.findByIdAndUpdate(id, data, { new: true })
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate('assignedManagers');
      
      if (playlist) {
        // Emit real-time update
        this.wsService.emitPlaylistUpdate(playlist.id, {
          action: 'updated',
          playlist
        });
      }
      
      return playlist;
    } catch (error) {
      throw error;
    }
  }

  async deletePlaylist(id: string) {
    try {
      await Playlist.findByIdAndDelete(id);
      
      // Emit real-time update
      this.wsService.emitPlaylistUpdate(id, {
        action: 'deleted',
        playlistId: id
      });
    } catch (error) {
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

  async getPlaylistManagers(playlistId: string) {
    try {
      const playlist = await Playlist.findById(playlistId).populate('assignedManagers');
      return playlist?.assignedManagers || [];
    } catch (error) {
      throw error;
    }
  }

  async assignManagers(playlistId: string, managerIds: string[]) {
    try {
      console.log('Assigning managers to playlist:', { playlistId, managerIds });

      // First verify the playlist exists
      const existingPlaylist = await Playlist.findById(playlistId);
      if (!existingPlaylist) {
        console.error('Playlist not found:', playlistId);
        throw new Error('Playlist not found');
      }

      // Convert string IDs to MongoDB ObjectIds
      const validManagerIds = managerIds.map(id => {
        try {
          return new Types.ObjectId(id);
        } catch (error) {
          console.error('Invalid manager ID format:', id);
          throw new Error(`Invalid manager ID format: ${id}`);
        }
      });

      console.log('Converted manager IDs:', validManagerIds);

      // Perform the update with $set operator and validated ObjectIds
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
          $set: { 
            assignedManagers: validManagerIds,
            updatedAt: new Date()
          }
        },
        { 
          new: true,
          runValidators: true
        }
      ).populate('assignedManagers');

      if (!updatedPlaylist) {
        console.error('Failed to update playlist:', playlistId);
        throw new Error('Failed to update playlist');
      }

      console.log('Updated playlist:', JSON.stringify(updatedPlaylist, null, 2));

      // Verify the update in database
      const verifyUpdate = await Playlist.findById(playlistId);
      console.log('Verification after update:', JSON.stringify(verifyUpdate, null, 2));

      // Emit real-time update if playlist was successfully updated
      if (updatedPlaylist) {
        this.wsService.emitPlaylistUpdate(updatedPlaylist._id, {
          action: 'updated',
          playlist: updatedPlaylist
        });
      }

      return updatedPlaylist;
    } catch (error) {
      console.error('Error in assignManagers:', error);
      throw error;
    }
  }
}