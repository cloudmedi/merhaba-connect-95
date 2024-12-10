import type { SystemInfo, WebSocketMessage, ElectronAPI } from '../../../electron/src/types/electron';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export type { SystemInfo, WebSocketMessage, ElectronAPI };