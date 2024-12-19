import { PlaylistManagerService } from './playlist/PlaylistManagerService';
import { PlaylistQueryService } from './playlist/PlaylistQueryService';
import { PlaylistMutationService } from './playlist/PlaylistMutationService';

export class PlaylistService {
  private managerService: PlaylistManagerService;
  private queryService: PlaylistQueryService;
  private mutationService: PlaylistMutationService;

  constructor(io: any) {
    this.managerService = new PlaylistManagerService(io);
    this.queryService = new PlaylistQueryService(io);
    this.mutationService = new PlaylistMutationService(io);
  }

  // Manager operations
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