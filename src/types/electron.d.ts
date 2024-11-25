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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}