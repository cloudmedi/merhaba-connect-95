export type DeviceCategory = 'player' | 'display' | 'controller';
export type DeviceStatus = 'online' | 'offline';

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
  branches?: {
    id: string;
    name: string;
    company_id: string | null;
  } | null;
}

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

type Json = string | number | boolean | null | JsonArray | JsonObject;
interface JsonObject { [key: string]: Json }
interface JsonArray extends Array<Json> {}