import type { Json } from "@/integrations/supabase/types";

export interface OfflinePlayer {
  id: string;
  name: string;
  branch_id?: string;
  category: string;
  status: string;
  ip_address?: string;
  system_info: Json;
  schedule: Json;
  last_seen?: string;
  token?: string;
  location?: string;
  location_id?: string;
  created_at: string;
  updated_at: string;
  device_id: string;
  last_sync_at: string;
  sync_status: 'pending' | 'syncing' | 'completed' | 'failed';
  version?: string;
  settings: {
    autoSync?: boolean;
    syncInterval?: number;
    maxStorageSize?: number;
    [key: string]: any;
  };
  devices?: {
    id: string;
    name: string;
    branch_id: string;
    status: string;
  };
}

export interface SyncHistory {
  id: string;
  player_id: string;
  sync_type: 'full' | 'partial' | 'metadata';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details: {
    total_files?: number;
    synced_files?: number;
    error_message?: string;
    [key: string]: any;
  };
  started_at: string;
  completed_at?: string;
  created_at: string;
}