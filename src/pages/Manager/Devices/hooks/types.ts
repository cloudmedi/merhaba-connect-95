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

export interface Device {
  id: string;
  name: string;
  category: 'player' | 'displayLet me help fix the TypeScript errors. The issues are:
1. The `health` property access on `system_info` needs type safety
2. The `category` field needs to be properly typed as a union type
3. The device type definitions need to match the database schema

<lov-code>
First, let's update the Device type definition:

<lov-write file_path="src/pages/Manager/Devices/hooks/types.ts">
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