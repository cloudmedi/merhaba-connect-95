import type { Json } from "@/integrations/supabase/types";

export interface SystemInfoCPU {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
}

export interface SystemInfoMemory {
  total: number;
  free: number;
  used: number;
}

export interface SystemInfoOS {
  platform: string;
  distro: string;
  release: string;
  arch: string;
}

export interface SystemInfoNetwork {
  iface: string;
  ip4: string;
  mac: string;
}

export interface DeviceSystemInfo {
  cpu?: SystemInfoCPU;
  memory?: SystemInfoMemory;
  os?: SystemInfoOS;
  network?: SystemInfoNetwork[];
  version?: string;
  [key: string]: Json | undefined;
}

export interface DeviceSchedule {
  powerOn?: string;
  powerOff?: string;
  [key: string]: Json | undefined;
}

export interface Device {
  id: string;
  name: string;
  category: 'player' | 'display' | 'controller';
  status: 'online' | 'offline';
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