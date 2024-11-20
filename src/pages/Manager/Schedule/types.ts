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
  start: Date;
  end: Date;
  playlistId: string;
  category: EventCategory;
  color: EventColor;
  branches: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  notifications: EventNotification[];
}