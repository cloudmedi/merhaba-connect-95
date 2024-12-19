import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

export class PlaylistManagerService extends BasePlaylistService {
  async assignManagers(playlistId: string, managerIds: string[]) {
    try {
      console.log('Assigning managers:', { playlistId, managerIds });
      
      const validManagerIds = await this.validateManagerIds(managerIds);
      
      const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { assignedManagers: validManagerIds },
        { 
          new: true,
          runValidators: true 
        }
      )
      .populate({
        path: 'assignedManagers',
        select: 'email firstName lastName',
        model: 'User'
      })
      .populate('songs.songId')
      .populate('categories')
      .populate('genre')
      .populate('mood');

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      console.log('Updated playlist with managers:', playlist);

      this.wsService.emitPlaylistUpdate(playlistId, {
        action: 'updated',
        playlist
      });

      return playlist;
    } catch (error) {
      console.error('Error assigning managers:', error);
      throw error;
    }
  }

  async getPlaylistManagers(playlistId: string) {
    try {
      console.log('Getting playlist managers for:', playlistId);
      
      const playlist = await Playlist.findById(playlistId)
        .populate({
          path: 'assignedManagers',
          select: 'email firstName lastName',
          model: 'User'
        });
      
      const managers = playlist?.assignedManagers || [];
      console.log('Found managers:', managers);
      
      return managers;
    } catch (error) {
      console.error('Error getting playlist managers:', error);
      throw error;
    }
  }
}