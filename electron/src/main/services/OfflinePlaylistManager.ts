import { FileSystemManager } from './FileSystemManager';
import { DownloadManager } from './DownloadManager';
import api from '../../lib/api';

interface Song {
  id: string;
  title: string;
  artist: string;
  file_url: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export class OfflinePlaylistManager {
  constructor(
    private fileSystem: FileSystemManager,
    private downloadManager: DownloadManager
  ) {
    console.log('OfflinePlaylistManager initialized');
  }

  async syncPlaylist(playlist: Playlist): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`Starting sync for playlist ${playlist.id} - ${playlist.name}`);
      
      if (!playlist || !playlist.songs || !Array.isArray(playlist.songs)) {
        console.error('Invalid playlist data:', playlist);
        return { success: false, error: 'Invalid playlist data' };
      }

      let totalSongs = playlist.songs.length;
      let downloadedSongs = 0;
      let errors = [];

      for (const song of playlist.songs) {
        const exists = await this.fileSystem.songExists(song.id);
        
        if (!exists) {
          console.log(`Downloading song ${song.id} - ${song.title}`);
          const result = await this.downloadManager.downloadSong(song.id, song.file_url);
          
          if (!result.success) {
            errors.push(`Failed to download ${song.title}: ${result.error}`);
            continue;
          }
        }
        downloadedSongs++;
      }

      await this.fileSystem.cleanup(playlist.songs.map(s => s.id));

      if (errors.length > 0) {
        return { 
          success: false, 
          error: `Some songs failed to download: ${errors.join(', ')}` 
        };
      }

      // Update sync status on server
      await api.post(`/manager/devices/playlists/${playlist.id}/sync`, {
        status: 'completed',
        syncedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Error syncing playlist:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  getDownloadProgress(songId: string): number {
    return this.downloadManager.getProgress(songId);
  }
}