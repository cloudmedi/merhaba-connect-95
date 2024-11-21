import type { Json } from "@/integrations/supabase/types/json";

export interface DeviceSystemInfo {
  version?: string;
  // Add other system info properties as needed
}

export interface DeviceSchedule {
  powerOn?: string;
  powerOff?: string;
  // Add other schedule properties as needed
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
  branches?: {
    id: string;
    name: string;
    company_id: string | null;
  } | null;
}