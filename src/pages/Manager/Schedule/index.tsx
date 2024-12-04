import { useState } from "react";
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

export default function Schedule() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const { events, isLoading, updateEvent } = useScheduleEvents();

  console.log('Schedule component - events:', events);

  const handleEventDrop = async (info: any) => {
    const updatedEvent: ScheduleEvent = {
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      start_time: info.event.start.toISOString(),
      end_time: info.event.end.toISOString(),
    };

    try {
      await updateEvent.mutateAsync(updatedEvent);
    } catch (error) {
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
    return <div>Loading...</div>;
  }

  const formattedEvents = events.map(event => {
    console.log('Formatting event:', event);
    return {
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      backgroundColor: event.color?.primary || '#6E59A5',
      borderColor: event.color?.primary || '#6E59A5',
      textColor: event.color?.text || '#ffffff',
      extendedProps: event
    };
  });

  console.log("Formatted events for calendar:", formattedEvents);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">Manage your playlists and announcements schedule</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportEvents(events, 'ics')}>
                Export as ICS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportEvents(events, 'csv')}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => setIsCreateEventOpen(true)}
            className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
          >
            + Create Event
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="calendar-container p-4">
          <style>
            {`
              .fc {
                --fc-border-color: #e5e7eb;
                --fc-button-bg-color: #fff;
                --fc-button-border-color: #d1d5db;
                --fc-button-text-color: #374151;
                --fc-button-hover-bg-color: #f3f4f6;
                --fc-button-hover-border-color: #9ca3af;
                --fc-button-active-bg-color: #6E59A5;
                --fc-button-active-border-color: #6E59A5;
                --fc-button-active-text-color: #fff;
                --fc-today-bg-color: #f3f4f6;
                --fc-now-indicator-color: #6E59A5;
              }
              
              .fc .fc-button {
                padding: 0.5rem 1rem;
                font-weight: 500;
                border-radius: 0.375rem;
                transition: all 0.2s;
              }

              .fc .fc-button:focus {
                box-shadow: 0 0 0 2px rgba(110, 89, 165, 0.2);
              }

              .fc .fc-toolbar-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #111827;
              }

              .fc .fc-col-header-cell {
                padding: 0.75rem 0;
                font-weight: 500;
                background-color: #f9fafb;
              }

              .fc .fc-timegrid-slot {
                height: 3rem;
              }

              .fc .fc-timegrid-slot-label {
                font-size: 0.875rem;
                color: #6b7280;
              }

              .fc .fc-event {
                border-radius: 0.25rem;
                padding: 0.25rem 0.5rem;
                font-size: 0.875rem;
                border: none;
                transition: transform 0.2s;
              }

              .fc .fc-event:hover {
                transform: translateY(-1px);
              }

              .fc .fc-toolbar.fc-header-toolbar {
                margin-bottom: 1.5rem;
              }

              .fc .fc-view-harness {
                background-color: #fff;
              }
            `}
          </style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            expandRows={true}
            height="auto"
            allDaySlot={false}
            slotDuration="01:00:00"
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            events={formattedEvents}
            select={handleSelect}
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