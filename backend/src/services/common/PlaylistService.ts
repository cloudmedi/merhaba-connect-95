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
      // Önce mevcut playlist'i çekelim
      const existingPlaylist = await Playlist.findById(id);
      if (!existingPlaylist) {
        throw new Error('Playlist not found');
      }

      // Update data'yı hazırlayalım
      const updateData = {
        ...data,
        // Eğer assignedManagers gönderilmemişse, mevcut değeri koruyalım
        assignedManagers: data.assignedManagers || existingPlaylist.assignedManagers,
        updatedAt: new Date()
      };

      // Update işlemini gerçekleştirelim
      const playlist = await Playlist.findByIdAndUpdate(
        id,
        { $set: updateData },
        { 
          new: true,
          runValidators: true 
        }
      )
      .populate('songs.songId')
      .populate('categories')
      .populate('genre')
      .populate('mood')
      .populate('assignedManagers');
      
      if (playlist) {
        // WebSocket update'i gönderelim
        this.wsService.emitPlaylistUpdate(playlist._id.toString(), {
          action: 'updated',
          playlist
        });
      }
      
      return playlist;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  }

  async assignManagers(playlistId: string, managerIds: string[]) {
    try {
      console.log('Starting assignManagers operation:', { playlistId, managerIds });

      if (!Types.ObjectId.isValid(playlistId)) {
        console.error('Invalid playlist ID format:', playlistId);
        throw new Error('Invalid playlist ID format');
      }

      const validManagerIds = managerIds.map(id => {
        if (!Types.ObjectId.isValid(id)) {
          console.error('Invalid manager ID format:', id);
          throw new Error(`Invalid manager ID format: ${id}`);
        }
        return new Types.ObjectId(id);
      });

      console.log('Validated manager IDs:', validManagerIds);

      // Atomic update işlemi
      const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: new Types.ObjectId(playlistId) },
        {
          $set: {
            assignedManagers: validManagerIds,
            updatedAt: new Date()
          }
        },
        {
          new: true,
          runValidators: true,
          populate: 'assignedManagers'
        }
      );

      if (!updatedPlaylist) {
        console.error('Playlist not found:', playlistId);
        throw new Error('Playlist not found');
      }

      console.log('Playlist updated successfully:', {
        id: updatedPlaylist._id,
        assignedManagers: updatedPlaylist.assignedManagers
      });

      // WebSocket update
      this.wsService.emitPlaylistUpdate(updatedPlaylist._id.toString(), {
        action: 'updated',
        playlist: updatedPlaylist
      });

      return updatedPlaylist;
    } catch (error) {
      console.error('Error in assignManagers:', error);
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
}
