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

export const generateEventColor = (category: string): { primary: string; secondary: string; text: string } => {
  const colors = {
    'Marketing': { primary: '#F97316', secondary: '#FEC6A1', text: '#1A1F2C' },
    'Special Promotion': { primary: '#D946EF', secondary: '#FFDEE2', text: '#1A1F2C' },
    'Holiday Music': { primary: '#0EA5E9', secondary: '#D3E4FD', text: '#1A1F2C' },
    'Regular Playlist': { primary: '#9b87f5', secondary: '#E5DEFF', text: '#1A1F2C' },
    'Background Music': { primary: '#8E9196', secondary: '#F1F0FB', text: '#1A1F2C' }
  };

  return colors[category as keyof typeof colors] || colors['Regular Playlist'];
};

export const exportEvents = (events: ScheduleEvent[], format: 'ics' | 'csv') => {
  if (format === 'ics') {
    const icsContent = events.map(event => `
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${new Date(event.start_time).toISOString()}
DTEND:${new Date(event.end_time).toISOString()}
DESCRIPTION:Category: ${event.category}
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
      ['Title', 'Start', 'End', 'Category', 'Devices'].join(','),
      ...events.map(event => [
        event.title,
        event.start_time,
        event.end_time,
        event.category,
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