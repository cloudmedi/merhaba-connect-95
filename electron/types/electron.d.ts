export interface ElectronAPI {
  getDeviceId: () => Promise<string>;
  playAudio: (url: string) => Promise<void>;
  pauseAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  onPlaybackStatusChange: (callback: (status: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}