export interface SystemInfo {
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
  disk: Array<{
    fs: string;
    size: number;
    used: number;
    available: number;
  }>;
  network: Array<{
    iface: string;
    ip4: string;
    mac: string;
  }>;
}

export interface WebSocketMessage {
  type: string;
  payload: {
    playlist?: {
      id: string;
      name: string;
      songs?: Array<{
        id: string;
        title: string;
      }>;
    };
    message?: string;
    error?: string;
    status?: 'online' | 'offline';
  };
}

export interface ElectronAPI {
  getSystemInfo: () => Promise<SystemInfo>;
  getDeviceId: () => Promise<string>;
  getMacAddress: () => Promise<string>;
  onSystemInfoUpdate: (callback: (data: SystemInfo) => void) => void;
  getEnvVars: () => Promise<Record<string, string>>;
  syncPlaylist: (playlist: any) => Promise<{ success: boolean; error?: string }>;
  getStorageStats: () => Promise<{ used: number; total: number }>;
  getDownloadProgress: (songId: string) => Promise<number>;
  onDownloadProgress: (callback: (data: { songId: string; progress: number }) => void) => () => void;
  onWebSocketMessage: (callback: (data: WebSocketMessage) => void) => () => void;
  onPlaylistUpdated: (callback: (playlist: any) => void) => () => void;
  registerDevice: (deviceInfo: { token: string }) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};