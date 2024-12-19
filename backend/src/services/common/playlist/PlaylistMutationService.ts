import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';
import { User } from '../../../models/admin/User';
import { Types } from 'mongoose';

export class PlaylistMutationService extends BasePlaylistService {
  async createPlaylist(data: any) {
    try {
      const playlist = new Playlist(data);
      await playlist.save();
      
      this.wsService.emitPlaylistUpdate(playlist.id, {
        action: 'created',
        playlist
      });
      
      return playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  async updatePlaylist(id: string, data: any) {
    try {
      const existingPlaylist = await this.findPlaylistById(id);
      if (!existingPlaylist) {
        throw new Error('Playlist not found');
      }

      // Fetch manager details from User model if assignedManagers array exists
      if (Array.isArray(data.assignedManagers)) {
        const managerIds = data.assignedManagers.map(id => new Types.ObjectId(id));
        const managers = await User.find(
          { _id: { $in: managerIds } },
          'email firstName lastName'
        );

        // Initialize a new playlist instance for proper typing
        const tempPlaylist = new Playlist();
        
        // Add each manager to the DocumentArray using create method
        managers.forEach(manager => {
          tempPlaylist.assignedManagers.push({
            _id: manager._id,
            email: manager.email,
            firstName: manager.firstName || '',
            lastName: manager.lastName || ''
          });
        });

        // Use the properly initialized DocumentArray
        data.assignedManagers = tempPlaylist.assignedManagers;
      }

      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      console.log('Updating playlist with data:', updateData);

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
      .populate('mood');
      
      if (playlist) {
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

  async deletePlaylist(id: string) {
    try {
      await Playlist.findByIdAndDelete(id);
      
      this.wsService.emitPlaylistUpdate(id, {
        action: 'deleted',
        playlistId: id
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  }
}