export interface SystemInfo {
  cpu?: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
  };
  memory?: {
    total: number;
    free: number;
    used: number;
  };
  os?: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
  };
  network?: Array<{
    iface: string;
    ip4: string;
    mac: string;
  }>;
  health?: 'healthy' | 'warning' | 'error';
}

export type DeviceCategory = 'player' | 'display' | 'controller';
export type DeviceStatus = 'online' | 'offline';

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  status: DeviceStatus;
  ip_address?: string;
  system_info?: SystemInfo;
  schedule?: {
    powerOn?: string;
    powerOff?: string;
  };
  token?: string;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
  location?: string;
  branch_id?: string;
  location_id?: string;
  created_by?: string;
  branches?: {
    id: string;
    name: string;
    company_id?: string;
  };
  schedule_device_assignments?: Array<{
    schedule?: {
      id: string;
      title: string;
    };
  }>;
  playlist_assignments?: Array<{
    playlist?: {
      id: string;
      name: string;
    };
  }>;
}