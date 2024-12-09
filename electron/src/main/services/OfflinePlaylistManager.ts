import { FileSystemManager } from './FileSystemManager';
import { DownloadManager } from './DownloadManager';

interface Song {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  bunny_id?: string;
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

      console.log('Songs to sync:', playlist.songs);
      
      if (playlist.songs.length === 0) {
        console.error('No songs in playlist');
        return { success: false, error: 'No songs in playlist' };
      }

      let totalSongs = playlist.songs.length;
      let downloadedSongs = 0;
      let errors = [];

      // Download songs that don't exist locally
      for (const song of playlist.songs) {
        if (!song || typeof song !== 'object') {
          console.error('Invalid song data:', song);
          errors.push('Invalid song data encountered');
          continue;
        }

        if (!song.id || !song.title || !song.file_url) {
          console.error('Missing required song properties:', song);
          errors.push(`Invalid song data for ${song.title || 'Unknown song'}`);
          continue;
        }

        const exists = await this.fileSystem.songExists(song.id);
        console.log(`Checking if song ${song.id} exists locally:`, exists);
        
        if (!exists) {
          console.log(`Downloading song ${song.id} - ${song.title}`);
          const url = song.bunny_id 
            ? `https://cloud-media.b-cdn.net/${song.bunny_id}`
            : song.file_url;
          console.log(`Using URL: ${url}`);
          
          const result = await this.downloadManager.downloadSong(song.id, url);
          console.log(`Download result for song ${song.id}:`, result);
          
          if (!result.success) {
            console.error(`Failed to download song ${song.id}:`, result.error);
            errors.push(`Failed to download ${song.title}: ${result.error}`);
            continue;
          }
        }
        downloadedSongs++;
        console.log(`Progress: ${downloadedSongs}/${totalSongs} songs`);
      }

      // Cleanup unused songs
      const keepSongIds = playlist.songs
        .filter(s => s && s.id)
        .map(s => s.id);
      await this.fileSystem.cleanup(keepSongIds);

      console.log(`Sync completed for playlist ${playlist.id}`);
      
      if (errors.length > 0) {
        return { 
          success: false, 
          error: `Some songs failed to download: ${errors.join(', ')}` 
        };
      }

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