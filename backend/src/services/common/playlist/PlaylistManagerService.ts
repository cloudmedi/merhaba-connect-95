import { Types } from 'mongoose';
import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

export class PlaylistManagerService extends BasePlaylistService {
  async assignManagers(playlistId: string, managerIds: string[]) {
    try {
      console.log('Starting assignManagers operation:', { playlistId, managerIds });

      const validManagerIds = await this.validateManagerIds(managerIds);
      console.log('Validated manager IDs:', validManagerIds);

      // Atomic update işlemi - $set yerine direkt array atama
      const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: new Types.ObjectId(playlistId) },
        {
          assignedManagers: validManagerIds,
          updatedAt: new Date()
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

  async getPlaylistManagers(playlistId: string) {
    try {
      const playlist = await Playlist.findById(playlistId).populate('assignedManagers');
      return playlist?.assignedManagers || [];
    } catch (error) {
      throw error;
    }
  }
}