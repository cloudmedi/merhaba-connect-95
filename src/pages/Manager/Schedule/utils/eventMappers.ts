import { DatabaseScheduleEvent, ScheduleEvent } from "../types/scheduleTypes";

export const mapDatabaseToScheduleEvent = (dbEvent: DatabaseScheduleEvent): ScheduleEvent => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    playlist_id: dbEvent.playlist_id,
    start_time: dbEvent.start_time,
    end_time: dbEvent.end_time,
    recurrence: dbEvent.recurrence ? JSON.parse(dbEvent.recurrence as string) : undefined,
    notifications: dbEvent.notifications ? JSON.parse(dbEvent.notifications as string) : undefined,
    created_by: dbEvent.created_by,
    company_id: dbEvent.company_id,
    created_at: dbEvent.created_at,
    updated_at: dbEvent.updated_at,
    playlist: dbEvent.playlists,
    devices: dbEvent.devices,
    color: { primary: '#6E59A5', secondary: '#E5DEFF', text: '#1A1F2C' }
  };
};

export const mapEventToDatabase = (event: Partial<ScheduleEvent>) => {
  const { color, devices, playlist, ...eventData } = event;
  return eventData;
};