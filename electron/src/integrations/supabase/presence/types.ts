import { RealtimeChannel } from '@supabase/supabase-js';

export interface SystemInfo {
  cpu?: string;
  memory?: string;
  os?: string;
  version?: string;
}

export interface PresenceState {
  token: string;
  status: 'online' | 'offline';
  systemInfo: SystemInfo | null;
  lastSeen: string;
}

export interface PresenceConfig {
  heartbeatInterval?: number;
  reconnectDelay?: number;
}