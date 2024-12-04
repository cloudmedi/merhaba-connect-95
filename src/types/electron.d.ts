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
  getSystemInfo: () => Promise<{
    cpu: {
      manufacturer: string;
      brand: string;
      speed: number;
      cores: number;
    };
    memory: {
      total: number;
      free: number;
      used: number;
    };
    os: {
      platform: string;
      distro: string;
      release: string;
      arch: string;
    };
    network: Array<{
      iface: string;
      ip4: string;
      mac: string;
    }>;
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}