import { Types } from 'mongoose';
import { BasePlaylistService } from './BasePlaylistService';
import { Playlist } from '../../../models/common/Playlist';

export class PlaylistManagerService extends BasePlaylistService {
  async assignManagers(playlistId: string, managerIds: string[]) {
    try {
      console.log('Starting assignManagers operation:', {
        playlistId,
        managerIds
      });

      const validManagerIds = await this.validateManagerIds(managerIds);
      console.log('Validated manager IDs:', validManagerIds);

      // Önce playlist'i bulalım
      const existingPlaylist = await Playlist.findById(playlistId);
      if (!existingPlaylist) {
        console.error('Playlist not found:', playlistId);
        throw new Error('Playlist not found');
      }

      console.log('Found existing playlist:', existingPlaylist);

      // Güncelleme işlemi
      existingPlaylist.assignedManagers = validManagerIds;
      existingPlaylist.updatedAt = new Date();

      // save() metodunu kullanarak güncelleme
      const updatedPlaylist = await existingPlaylist.save();
      
      console.log('Save operation completed. Updated playlist:', updatedPlaylist);

      // Populate işlemi
      const populatedPlaylist = await Playlist.findById(updatedPlaylist._id)
        .populate('assignedManagers');

      if (!populatedPlaylist) {
        console.error('Failed to populate playlist after update');
        throw new Error('Failed to populate playlist after update');
      }

      console.log('Playlist populated successfully:', {
        id: populatedPlaylist._id,
        assignedManagers: populatedPlaylist.assignedManagers
      });

      // WebSocket update
      this.wsService.emitPlaylistUpdate(populatedPlaylist._id.toString(), {
        action: 'updated',
        playlist: populatedPlaylist
      });

      return populatedPlaylist;
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
      console.error('Error in getPlaylistManagers:', error);
      throw error;
    }
  }
}