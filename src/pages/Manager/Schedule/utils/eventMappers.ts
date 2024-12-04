import { DatabaseScheduleEvent, ScheduleEvent, EventNotification, EventRecurrence } from "../types/scheduleTypes";
import type { Json } from "@/integrations/supabase/types";

// Predefined color schemes for events
const EVENT_COLORS = [
  { primary: '#9b87f5', secondary: '#E5DEFF', text: '#1A1F2C' }, // Purple
  { primary: '#F97316', secondary: '#FFEDD5', text: '#1A1F2C' }, // Orange
  { primary: '#0EA5E9', secondary: '#E0F2FE', text: '#1A1F2C' }, // Blue
  { primary: '#10B981', secondary: '#D1FAE5', text: '#1A1F2C' }, // Green
  { primary: '#F43F5E', secondary: '#FFE4E6', text: '#1A1F2C' }, // Red
  { primary: '#8B5CF6', secondary: '#EDE9FE', text: '#1A1F2C' }, // Indigo
  { primary: '#EC4899', secondary: '#FCE7F3', text: '#1A1F2C' }, // Pink
  { primary: '#06B6D4', secondary: '#CFFAFE', text: '#1A1F2C' }, // Cyan
];

// Generate a consistent color based on the event ID
function getEventColor(id: string): typeof EVENT_COLORS[0] {
  const index = Math.abs(
    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % EVENT_COLORS.length;
  return EVENT_COLORS[index];
}

export const mapDatabaseToScheduleEvent = (dbEvent: DatabaseScheduleEvent): ScheduleEvent => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || undefined,
    playlist_id: dbEvent.playlist_id || undefined,
    start_time: dbEvent.start_time,
    end_time: dbEvent.end_time,
    recurrence: dbEvent.recurrence ? JSON.parse(dbEvent.recurrence as string) as EventRecurrence : undefined,
    notifications: dbEvent.notifications ? JSON.parse(dbEvent.notifications as string) as EventNotification[] : undefined,
    created_by: dbEvent.created_by || undefined,
    company_id: dbEvent.company_id || undefined,
    created_at: dbEvent.created_at || undefined,
    updated_at: dbEvent.updated_at || undefined,
    playlist: dbEvent.playlists,
    devices: dbEvent.devices,
    color: getEventColor(dbEvent.id)
  };
};

export const mapEventToDatabase = (event: Partial<ScheduleEvent>): Omit<DatabaseScheduleEvent, 'playlists' | 'devices'> => {
  const id = event.id || crypto.randomUUID();
  
  return {
    id,
    title: event.title || '',
    description: event.description || null,
    playlist_id: event.playlist_id || null,
    start_time: event.start_time || new Date().toISOString(),
    end_time: event.end_time || new Date().toISOString(),
    notifications: event.notifications ? JSON.stringify(event.notifications) as Json : null,
    recurrence: event.recurrence ? JSON.stringify(event.recurrence) as Json : null,
    created_by: event.created_by || null,
    company_id: event.company_id || null,
    created_at: event.created_at || new Date().toISOString(),
    updated_at: event.updated_at || new Date().toISOString()
  };
};