import type { Json } from "@/integrations/supabase/types";

export interface EventColor {
  primary: string;
  secondary: string;
  text: string;
}

export interface EventNotification {
  type: 'email' | 'system' | 'both';
  timing: number;
}

export interface EventRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  playlist_id?: string;
  start_time: string;
  end_time: string;
  color: EventColor;
  recurrence?: EventRecurrence;
  notifications?: EventNotification[];
  created_by?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  playlist?: {
    id: string;
    name: string;
    artwork_url?: string;
  };
  devices?: Array<{
    device_id: string;
  }>;
}

export interface DatabaseScheduleEvent {
  id: string;
  title: string;
  description?: string | null;
  playlist_id?: string | null;
  start_time: string;
  end_time: string;
  recurrence?: Json;
  notifications?: Json;
  created_by?: string | null;
  company_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  playlists?: {
    id: string;
    name: string;
    artwork_url?: string;
  };
  devices?: Array<{
    device_id: string;
  }>;
}