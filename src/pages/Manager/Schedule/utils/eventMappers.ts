import { DatabaseScheduleEvent, ScheduleEvent } from "../types/scheduleTypes";

export const mapDatabaseToScheduleEvent = (dbEvent: DatabaseScheduleEvent): ScheduleEvent => {
  console.log('🗺️ Mapping database event:', dbEvent);
  
  const mappedEvent: ScheduleEvent = {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    playlist_id: dbEvent.playlist_id,
    start_time: dbEvent.start_time,
    end_time: dbEvent.end_time,
    recurrence: dbEvent.recurrence ? JSON.parse(JSON.stringify(dbEvent.recurrence)) : undefined,
    notifications: dbEvent.notifications ? JSON.parse(JSON.stringify(dbEvent.notifications)) : undefined,
    created_by: dbEvent.created_by,
    company_id: dbEvent.company_id,
    created_at: dbEvent.created_at,
    updated_at: dbEvent.updated_at,
    playlist: dbEvent.playlists,
    devices: dbEvent.devices,
    color: { primary: '#6E59A5', secondary: '#E5DEFF', text: '#1A1F2C' }
  };

  console.log('✨ Mapped event:', mappedEvent);
  return mappedEvent;
};

export const mapEventToDatabase = (event: Omit<ScheduleEvent, 'id' | 'color'>) => {
  console.log('📝 Mapping event to database format:', event);
  
  const dbEvent = {
    title: event.title,
    description: event.description,
    playlist_id: event.playlist_id,
    start_time: event.start_time,
    end_time: event.end_time,
    recurrence: event.recurrence ? JSON.stringify(event.recurrence) : null,
    notifications: event.notifications ? JSON.stringify(event.notifications) : null,
  };

  console.log('💾 Mapped database event:', dbEvent);
  return dbEvent;
};