import { ScheduleEvent } from "../types";

export const checkEventConflicts = (
  newEvent: ScheduleEvent,
  existingEvents: ScheduleEvent[]
): ScheduleEvent[] => {
  return existingEvents.filter(existingEvent => {
    const hasTimeConflict =
      (newEvent.start <= existingEvent.end && newEvent.end >= existingEvent.start);
    
    const hasBranchOverlap = newEvent.branches.some(branch =>
      existingEvent.branches.includes(branch)
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
    // Implementation for ICS export
    const icsContent = events.map(event => `
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${event.start.toISOString()}
DTEND:${event.end.toISOString()}
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
    // Implementation for CSV export
    const csvContent = [
      ['Title', 'Start', 'End', 'Category', 'Branches'].join(','),
      ...events.map(event => [
        event.title,
        event.start.toISOString(),
        event.end.toISOString(),
        event.category,
        event.branches.join(';')
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