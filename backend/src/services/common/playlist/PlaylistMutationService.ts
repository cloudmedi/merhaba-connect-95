import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

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

      // Prepare manager data
      const assignedManagers = Array.isArray(data.assignedManagers) 
        ? data.assignedManagers.map((manager: any) => ({
            _id: manager._id,
            email: manager.email,
            firstName: manager.firstName,
            lastName: manager.lastName
          }))
        : existingPlaylist.assignedManagers;

      const updateData = {
        ...data,
        assignedManagers,
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