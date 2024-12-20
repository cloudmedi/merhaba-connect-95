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
      console.log('Fetching hero playlist...');
      const heroPlaylist = await Playlist.findOne({ isHero: true })
        .populate('songs.songId')
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: '_id email firstName lastName'
        });

      console.log('Hero playlist found:', {
        id: heroPlaylist?._id,
        name: heroPlaylist?.name,
        isPublic: heroPlaylist?.isPublic,
        assignedManagers: heroPlaylist?.assignedManagers?.map(m => ({
          _id: m._id,
          email: m.email
        }))
      });

      return heroPlaylist;
    } catch (error) {
      console.error('Error fetching hero playlist:', error);
      throw error;
    }
  }

  async getManagerPlaylists(managerId: string) {
    console.log('Getting playlists for manager:', managerId);
    const playlists = await this.queryService.getManagerPlaylists(managerId);
    console.log('Found playlists count:', playlists.length);
    return playlists;
  }

  async assignManagers(playlistId: string, managerIds: string[]) {
    return this.managerService.assignManagers(playlistId, managerIds);
  }

  async getPlaylistManagers(playlistId: string) {
    return this.managerService.getPlaylistManagers(playlistId);
  }

  // Query operations
  async getAllPlaylists() {
    return this.queryService.getAllPlaylists();
  }

  async getPlaylistSongs(playlistId: string) {
    return this.queryService.getPlaylistSongs(playlistId);
  }

  async getPlaylistCategories(playlistId: string) {
    return this.queryService.getPlaylistCategories(playlistId);
  }

  // Mutation operations
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