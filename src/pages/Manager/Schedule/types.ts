export type EventCategory = 'Marketing' | 'Special Promotion' | 'Holiday Music' | 'Regular Playlist' | 'Background Music';

export type EventColor = {
  primary: string;
  secondary: string;
  text: string;
};

export interface EventNotification {
  type: 'email' | 'system' | 'both';
  timing: number; // minutes before event
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  playlist_id?: string;
  start_time: Date;
  end_time: Date;
  category: EventCategory;
  color: EventColor;
  branches?: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
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