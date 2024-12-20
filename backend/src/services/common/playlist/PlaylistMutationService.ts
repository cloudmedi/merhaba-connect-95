import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';
import { User } from '../../../models/admin/User';
import { Types } from 'mongoose';

export class PlaylistMutationService extends BasePlaylistService {
  async createPlaylist(data: any) {
    try {
      console.log('Creating playlist with data:', data);
      
      // Fetch manager details from User model if assignedManagers array exists
      if (Array.isArray(data.assignedManagers)) {
        const managerIds = data.assignedManagers.map((id: string) => new Types.ObjectId(id));
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

      const playlist = new Playlist(data);
      await playlist.save();

      // Populate the saved playlist with all necessary fields
      const populatedPlaylist = await Playlist.findById(playlist._id)
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
        });
      
      this.wsService.emitPlaylistUpdate(playlist.id, {
        action: 'created',
        playlist: populatedPlaylist
      });
      
      return populatedPlaylist;
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
        const managerIds = data.assignedManagers.map((id: string) => new Types.ObjectId(id));
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

      // Update the playlist and get the populated version
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        id,
        { $set: data },
        { 
          new: true,
          runValidators: true 
        }
      )
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
      });

      if (updatedPlaylist) {
        this.wsService.emitPlaylistUpdate(id, {
          action: 'updated',
          playlist: updatedPlaylist
        });
      }
      
      return updatedPlaylist;
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