export interface PresenceConfig {
  heartbeatInterval?: number;
  reconnectDelay?: number;
}

export type DeviceStatus = 'online' | 'offline';