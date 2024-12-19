import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

export class PlaylistManagerService extends BasePlaylistService {
  async assignManagers(playlistId: string, managerIds: string[]) {
    try {
      const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { assignedManagers: managerIds },
        { 
          new: true,
          runValidators: true 
        }
      )
      .populate({
        path: 'assignedManagers',
        select: 'email firstName lastName'
      })
      .populate('songs.songId')
      .populate('categories')
      .populate('genre')
      .populate('mood');

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      // WebSocket üzerinden güncellemeyi bildir
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
      const playlist = await Playlist.findById(playlistId)
        .populate({
          path: 'assignedManagers',
          select: 'email firstName lastName'
        });
      
      return playlist?.assignedManagers || [];
    } catch (error) {
      throw error;
    }
  }
}