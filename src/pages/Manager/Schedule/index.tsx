import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "./components/CreateEventDialog";
import { ScheduleEvent } from "./types";
import { exportEvents } from "./utils/eventUtils";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useScheduleEvents } from "./hooks/useScheduleEvents";
import { toast } from "sonner";

export default function Schedule() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const { events, isLoading, updateEvent } = useScheduleEvents();

  const handleEventDrop = async (info: any) => {
    const updatedEvent = {
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    };

    try {
      await updateEvent.mutateAsync(updatedEvent);
    } catch (error) {
      toast.error("Failed to update event");
      info.revert();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

      <div className="bg-white rounded-lg shadow p-6">
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
          events={events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start_time,
            end: event.end_time,
            backgroundColor: event.color.primary,
            borderColor: event.color.primary,
            textColor: event.color.text,
            extendedProps: event
          }))}
        />
      </div>

      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen}
        existingEvents={events}
      />
    </div>
  );
}