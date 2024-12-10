export interface Song {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  bunny_id?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface SyncStatus {
  playlistId: string;
  name: string;
  progress: number;
  status: 'pending' | 'syncing' | 'completed' | 'error';
}

export interface DownloadProgressData {
  songId: string;
  progress: number;
}