interface SystemInfo {
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
}

interface WebSocketMessage {
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

interface ElectronAPI {
  getSystemInfo: () => Promise<SystemInfo>;
  getDeviceId: () => Promise<string>;
  getMacAddress: () => Promise<string | null>;
  onSystemInfoUpdate: (callback: (data: SystemInfo) => void) => void;
  getEnvVars: () => Promise<Record<string, string>>;
  syncPlaylist: (playlist: any) => Promise<{ success: boolean; error?: string }>;
  getStorageStats: () => Promise<{ used: number; total: number }>;
  getDownloadProgress: (songId: string) => Promise<number>;
  onDownloadProgress: (callback: (data: { songId: string; progress: number }) => void) => () => void;
  onWebSocketMessage: (callback: (data: WebSocketMessage) => void) => () => void;
  onWebSocketConnected: (callback: () => void) => () => void;
  onWebSocketError: (callback: (error: string) => void) => () => void;
  registerDevice: (deviceInfo: { id: string; name: string; type: string }) => Promise<{ token: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export type { SystemInfo, WebSocketMessage, ElectronAPI };