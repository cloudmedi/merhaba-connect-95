export interface PresenceConfig {
  heartbeatInterval?: number;
  reconnectDelay?: number;
}

export type DeviceStatus = 'online' | 'offline';

export interface DevicePresenceState {
  token: string;
  online_at: string;
}