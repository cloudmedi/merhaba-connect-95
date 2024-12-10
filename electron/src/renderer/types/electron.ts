export interface SystemInfo {
  cpu: string;
  memory: string;
  os: string;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface ElectronAPI {
  getSystemInfo: () => Promise<SystemInfo>;
  getDeviceId: () => Promise<string>;
  getMacAddress: () => Promise<string>;
  onSystemInfoUpdate: (callback: (data: SystemInfo) => void) => void;
  getEnvVars: () => Promise<Record<string, string>>;
  syncPlaylist: (playlist: any) => Promise<void>;
  getStorageStats: () => Promise<any>;
  getDownloadProgress: (songId: string) => Promise<number>;
  onDownloadProgress: (callback: (data: { songId: string; progress: number }) => void) => () => void;
  onWebSocketMessage: (callback: (data: WebSocketMessage) => void) => () => void;
  onPlaylistReceived: (callback: (playlist: any) => void) => () => void;
  registerDevice: (deviceInfo: any) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}