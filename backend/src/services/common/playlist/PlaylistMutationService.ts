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
      throw error;
    }
  }

  async updatePlaylist(id: string, data: any) {
    try {
      // Önce mevcut playlist'i çekelim
      const existingPlaylist = await this.findPlaylistById(id);
      if (!existingPlaylist) {
        throw new Error('Playlist not found');
      }

      // Update data'yı hazırlayalım ve mevcut assignedManagers'ı koruyalım
      const updateData = {
        ...data,
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
      throw error;
    }
  }
}