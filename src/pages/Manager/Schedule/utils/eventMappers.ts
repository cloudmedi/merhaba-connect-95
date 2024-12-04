import { Json } from "@/integrations/supabase/types";
import { DatabaseScheduleEvent, ScheduleEvent, EventRecurrence, EventNotification } from "../types/scheduleTypes";

export const mapDatabaseToScheduleEvent = (dbEvent: DatabaseScheduleEvent): ScheduleEvent => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  playlist_id: dbEvent.playlist_id,
  start_time: dbEvent.start_time,
  end_time: dbEvent.end_time,
  recurrence: dbEvent.recurrence ? (dbEvent.recurrence as unknown as EventRecurrence) : undefined,
  notifications: dbEvent.notifications ? (dbEvent.notifications as unknown as EventNotification[]) : undefined,
  created_by: dbEvent.created_by,
  company_id: dbEvent.company_id,
  created_at: dbEvent.created_at,
  updated_at: dbEvent.updated_at,
  playlist: dbEvent.playlists,
  devices: dbEvent.devices,
  color: { primary: '#6E59A5', secondary: '#E5DEFF', text: '#1A1F2C' }
});

export const mapEventToDatabase = (event: Omit<ScheduleEvent, 'id' | 'color'>) => ({
  title: event.title,
  description: event.description,
  playlist_id: event.playlist_id,
  start_time: event.start_time,
  end_time: event.end_time,
  recurrence: event.recurrence ? (event.recurrence as unknown as Json) : null,
  notifications: event.notifications ? (event.notifications as unknown as Json) : null,
});