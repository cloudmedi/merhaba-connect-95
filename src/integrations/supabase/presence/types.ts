export const REALTIME_CHANNEL_PREFIX = 'realtime:device_';
export const PLAYLIST_SYNC_EVENT = 'playlist_sync';

export interface PresenceConfig {
  heartbeatInterval?: number;
  reconnectDelay?: number;
}

export interface DeviceStatus {
  status: 'online' | 'offline';
  lastSeen?: string;
  systemInfo?: Record<string, any>;
}