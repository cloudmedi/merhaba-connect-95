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
  syncPlaylist: (playlist: {
    id: string;
    name: string;
    songs: Array<{
      id: string;
      title: string;
      artist?: string;
      file_url: string;
      bunny_id?: string;
    }>;
  }) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}