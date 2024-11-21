import type { Json } from "@/integrations/supabase/types/json";

export type EventCategory = 'Marketing' | 'Special Promotion' | 'Holiday Music' | 'Regular Playlist' | 'Background Music';

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
  category: EventCategory;
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