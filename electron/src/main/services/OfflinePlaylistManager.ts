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
  ) {}

  async syncPlaylist(playlist: Playlist): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`Starting sync for playlist ${playlist.id} - ${playlist.name}`);
      
      // Save playlist info locally
      await this.fileSystem.savePlaylistInfo(playlist.id, {
        id: playlist.id,
        name: playlist.name,
        songs: playlist.songs.map(s => ({
          id: s.id,
          title: s.title,
          artist: s.artist
        }))
      });

      let totalSongs = playlist.songs.length;
      let downloadedSongs = 0;

      // Download songs that don't exist locally
      for (const song of playlist.songs) {
        if (!await this.fileSystem.songExists(song.id)) {
          console.log(`Downloading song ${song.id} - ${song.title}`);
          const url = song.file_url;
          console.log(`Using URL: ${url}`);
          
          const result = await this.downloadManager.downloadSong(song.id, url);
          
          if (!result.success) {
            console.error(`Failed to download song ${song.id}:`, result.error);
            continue;
          }

          await this.fileSystem.saveMetadata(song.id, {
            id: song.id,
            title: song.title,
            artist: song.artist,
            hash: result.hash,
            downloadedAt: new Date().toISOString()
          });
        }
        downloadedSongs++;
        console.log(`Progress: ${downloadedSongs}/${totalSongs} songs`);
      }

      // Cleanup unused songs
      const keepSongIds = playlist.songs.map(s => s.id);
      await this.fileSystem.cleanup(keepSongIds);

      console.log(`Sync completed for playlist ${playlist.id}`);
      return { success: true };
    } catch (error) {
      console.error('Error syncing playlist:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }
}