export interface ElectronAPI {
  registerDevice: (deviceInfo: any) => Promise<any>;
  getDeviceId: () => Promise<string>;
  onSyncStatusChange: (callback: (status: string) => void) => void;
  playAudio: (url: string) => Promise<void>;
  pauseAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getCurrentTime: () => Promise<number>;
  setCurrentTime: (time: number) => Promise<void>;
  onPlaybackStatusChange: (callback: (status: any) => void) => void;
  startPlaylistDownload: (playlistId: string) => Promise<{ success: boolean; error?: string }>;
  getDownloadStatus: (playlistId: string) => Promise<{
    songs: Array<{
      id: string;
      bunnyId: string;
      status: 'pending' | 'downloading' | 'completed' | 'error';
      progress: number;
    }>;
    totalSongs: number;
    completedSongs: number;
  } | null>;
  checkSongDownloaded: (songId: string) => Promise<{ downloaded: boolean; path?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}