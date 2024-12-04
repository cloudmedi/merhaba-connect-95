import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "./components/CreateEventDialog";
import { ScheduleEvent } from "./types/scheduleTypes";
import { exportEvents } from "./utils/eventUtils";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useScheduleEvents } from "@/hooks/useScheduleEvents";
import { toast } from "sonner";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarView } from "./components/CalendarView";

export default function Schedule() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const { events, isLoading, updateEvent } = useScheduleEvents();

  useEffect(() => {
    console.log('Schedule mounted - Events:', events);
  }, [events]);

  const handleEventDrop = async (info: any) => {
    console.log('Event drop - Info:', info);
    const updatedEvent: ScheduleEvent = {
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      start_time: info.event.start.toISOString(),
      end_time: info.event.end.toISOString(),
    };

    try {
      await updateEvent.mutateAsync(updatedEvent);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error("Failed to update event");
      info.revert();
    }
  };

  const handleSelect = (selectInfo: any) => {
    console.log("Selected time range:", {
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString()
    });
    
    setSelectedTimeRange({
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString()
    });
    setIsCreateEventOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const formattedEvents = events.map(event => {
    console.log('Formatting event:', event);
    const formattedEvent = {
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      backgroundColor: event.color?.primary || '#6E59A5',
      borderColor: event.color?.primary || '#6E59A5',
      textColor: event.color?.text || '#ffffff',
      extendedProps: event
    };
    console.log('Formatted event:', formattedEvent);
    return formattedEvent;
  });

  console.log("Final formatted events for calendar:", formattedEvents);

  return (
    <div className="p-6 space-y-6">
      <CalendarHeader 
        onCreateEvent={() => setIsCreateEventOpen(true)}
        onExport={exportEvents}
        events={events}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="calendar-container p-4">
          <CalendarView
            events={formattedEvents}
            onEventDrop={handleEventDrop}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen}
        existingEvents={events}
        initialTimeRange={selectedTimeRange}
      />
    </div>
  );
}