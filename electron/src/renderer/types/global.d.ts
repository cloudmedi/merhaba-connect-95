import type { ElectronAPI } from '../../../electron/src/types/electron';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};