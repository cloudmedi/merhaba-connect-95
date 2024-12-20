import { PlaylistManagerService } from './playlist/PlaylistManagerService';
import { PlaylistQueryService } from './playlist/PlaylistQueryService';
import { PlaylistMutationService } from './playlist/PlaylistMutationService';
import { Playlist } from '../../models/common/Playlist';

export class PlaylistService {
  private managerService: PlaylistManagerService;
  private queryService: PlaylistQueryService;
  private mutationService: PlaylistMutationService;

  constructor(io: any) {
    this.managerService = new PlaylistManagerService(io);
    this.queryService = new PlaylistQueryService(io);
    this.mutationService = new PlaylistMutationService(io);
  }

  async getHeroPlaylist() {
    try {
      const heroPlaylist = await Playlist.findOne({ isHero: true })
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: 'email firstName lastName',
          model: 'User'
        });
      return heroPlaylist;
    } catch (error) {
      console.error('Error fetching hero playlist:', error);
      throw error;
    }
  }

  async getManagerPlaylists(managerId: string) {
    return this.queryService.getManagerPlaylists(managerId);
  }

  async assignManagers(playlistId: string, managerIds: string[]) {
    return this.managerService.assignManagers(playlistId, managerIds);
  }

  async getPlaylistManagers(playlistId: string) {
    return this.managerService.getPlaylistManagers(playlistId);
  }

  async getAllPlaylists() {
    return this.queryService.getAllPlaylists();
  }

  async getPlaylistSongs(playlistId: string) {
    return this.queryService.getPlaylistSongs(playlistId);
  }

  async getPlaylistCategories(playlistId: string) {
    return this.queryService.getPlaylistCategories(playlistId);
  }

  async createPlaylist(data: any) {
    return this.mutationService.createPlaylist(data);
  }

  async updatePlaylist(id: string, data: any) {
    return this.mutationService.updatePlaylist(id, data);
  }

  async deletePlaylist(id: string) {
    return this.mutationService.deletePlaylist(id);
  }
}