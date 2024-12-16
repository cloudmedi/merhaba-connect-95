import { Playlist } from '../../models/common/Playlist';
import { WebSocketService } from './WebSocketService';

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

  async getPlaylistById(id: string) {
    try {
      return await Playlist.findById(id)
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate('assignedManagers');
    } catch (error) {
      throw error;
    }
  }

  async assignManagersToPlaylist(playlistId: string, managerIds: string[]) {
    try {
      const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { assignedManagers: managerIds },
        { new: true }
      ).populate('assignedManagers');
      
      if (playlist) {
        // Emit real-time update
        this.wsService.emitPlaylistUpdate(playlist.id, {
          action: 'managers-assigned',
          playlist
        });
      }
      
      return playlist;
    } catch (error) {
      throw error;
    }
  }
}