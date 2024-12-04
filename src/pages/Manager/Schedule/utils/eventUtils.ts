import { ScheduleEvent } from "../types";

export const checkEventConflicts = (
  newEvent: ScheduleEvent,
  existingEvents: ScheduleEvent[]
): ScheduleEvent[] => {
  return existingEvents.filter(existingEvent => {
    const hasTimeConflict =
      (new Date(newEvent.start_time) <= new Date(existingEvent.end_time) && 
       new Date(newEvent.end_time) >= new Date(existingEvent.start_time));
    
    const hasBranchOverlap = newEvent.devices?.some(device =>
      existingEvent.devices?.some(existingDevice => existingDevice.device_id === device.device_id)
    );

    return hasTimeConflict && hasBranchOverlap;
  });
};

export const generateEventColor = (): { primary: string; secondary: string; text: string } => {
  return { primary: '#9b87f5', secondary: '#E5DEFF', text: '#1A1F2C' };
};

export const exportEvents = (events: ScheduleEvent[], format: 'ics' | 'csv') => {
  if (format === 'ics') {
    const icsContent = events.map(event => `
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${new Date(event.start_time).toISOString()}
DTEND:${new Date(event.end_time).toISOString()}
DESCRIPTION:${event.description || ''}
END:VEVENT
    `).join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule.ics';
    link.click();
  } else {
    const csvContent = [
      ['Title', 'Start', 'End', 'Description', 'Devices'].join(','),
      ...events.map(event => [
        event.title,
        event.start_time,
        event.end_time,
        event.description || '',
        event.devices?.map(d => d.device_id).join(';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule.csv';
    link.click();
  }
};