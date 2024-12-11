import type { Json } from "@/integrations/supabase/types";

export interface SystemInfo {
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
  };
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
  };
  network: Array<{
    iface: string;
    ip4: string;
    mac: string;
  }>;
  health?: 'healthy' | 'warning' | 'error';
}

export interface DeviceSystemInfo {
  version?: string;
  cpu?: SystemInfo['cpu'];
  memory?: SystemInfo['memory'];
  os?: SystemInfo['os'];
  network?: SystemInfo['network'];
  health?: SystemInfo['health'];
  [key: string]: Json | undefined;
}

export interface DeviceSchedule {
  powerOn?: string;
  powerOff?: string;
  [key: string]: Json | undefined;
}

export type DeviceCategory = 'player' | 'display' | 'controller';
export type DeviceStatus = 'online' | 'offline';

export interface DeviceBranch {
  id: string;
  name: string;
  company_id?: string | null;
}

export interface PlaylistInfo {
  id: string;
  name: string;
}

export interface PlaylistAssignment {
  playlist?: PlaylistInfo;
}

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  status: DeviceStatus;
  ip_address?: string | null;
  system_info: DeviceSystemInfo;
  schedule: DeviceSchedule;
  token?: string;
  last_seen?: string | null;
  created_at?: string;
  updated_at?: string;
  location?: string | null;
  branch_id?: string | null;
  location_id?: string | null;
  created_by?: string;
  branches?: DeviceBranch | null;
  playlist_assignments?: PlaylistAssignment[];
  volume?: number;
}