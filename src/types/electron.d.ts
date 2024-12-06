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
  syncPlaylist: (playlist: any) => Promise<{ success: boolean; error?: string }>;
  getStorageStats: () => Promise<{ used: number; total: number }>;
  getDownloadProgress: (songId: string) => Promise<number>;
  onDownloadProgress: (callback: (data: { songId: string; progress: number }) => void) => () => void;
  onWebSocketMessage: (callback: (data: any) => void) => () => void;
  onWebSocketConnected: (callback: () => void) => () => void;
  onWebSocketError: (callback: (error: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}