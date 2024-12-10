export interface PresenceConfig {
  heartbeatInterval?: number;
  reconnectDelay?: number;
}

export type DeviceStatus = 'online' | 'offline';

export interface DevicePresenceState {
  token: string;
  device_id: string;
  online_at: string;
}