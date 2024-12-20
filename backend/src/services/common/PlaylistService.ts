import { PlaylistManagerService } from './playlist/PlaylistManagerService';
import { PlaylistQueryService } from './playlist/PlaylistQueryService';
import { PlaylistMutationService } from './playlist/PlaylistMutationService';
import { Playlist } from '../../models/common/Playlist';
import { Types } from 'mongoose';

export class PlaylistService {
  private managerService: PlaylistManagerService;
  private queryService: PlaylistQueryService;
  private mutationService: PlaylistMutationService;

  constructor(io: any) {
    this.managerService = new PlaylistManagerService(io);
    this.queryService = new PlaylistQueryService(io);
    this.mutationService = new PlaylistMutationService(io);
  }

  async getHeroPlaylist(managerId?: string) {
    try {
      console.log('Fetching hero playlist for manager:', managerId);
      
      if (!managerId) {
        console.log('No manager ID provided, returning null');
        return null;
      }

      const managerObjectId = new Types.ObjectId(managerId);
      
      const query = {
        isHero: true,
        $or: [
          { isPublic: true },
          { 
            assignedManagers: {
              $elemMatch: { 
                _id: managerObjectId 
              }
            }
          }
        ]
      };

      console.log('Executing hero playlist query:', JSON.stringify(query, null, 2));

      const playlist = await Playlist.findOne(query)
        .populate({
          path: 'songs.songId',
          select: 'title artist album duration fileUrl artworkUrl'
        })
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: '_id email firstName lastName'
        });

      console.log('Hero playlist query result:', {
        found: !!playlist,
        playlistId: playlist?._id,
        isPublic: playlist?.isPublic,
        isHero: playlist?.isHero,
        songsCount: playlist?.songs?.length,
        artworkUrl: playlist?.artworkUrl,
        assignedManagersCount: playlist?.assignedManagers?.length
      });

      return playlist;
    } catch (error) {
      console.error('Error fetching hero playlist:', error);
      throw error;
    }
  }

  async getManagerPlaylists(managerId: string) {
    try {
      console.log('Getting playlists for manager:', managerId);
      
      if (!managerId) {
        throw new Error('Manager ID is required');
      }

      const managerObjectId = new Types.ObjectId(managerId);
      
      const query = {
        $or: [
          { isPublic: true },
          { 
            assignedManagers: {
              $elemMatch: { 
                _id: managerObjectId 
              }
            }
          }
        ]
      };

      console.log('Executing manager playlists query:', JSON.stringify(query, null, 2));

      const playlists = await Playlist.find(query)
        .populate({
          path: 'songs.songId',
          select: 'title artist album duration fileUrl artworkUrl'
        })
        .populate('categories')
        .populate('genre')
        .populate('mood')
        .populate({
          path: 'assignedManagers',
          select: '_id email firstName lastName'
        })
        .sort({ createdAt: -1 });

      console.log(`Found ${playlists.length} playlists for manager`);
      return playlists;
    } catch (error) {
      console.error('Error fetching manager playlists:', error);
      throw error;
    }
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