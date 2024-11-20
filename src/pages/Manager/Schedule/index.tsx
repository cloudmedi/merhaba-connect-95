import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CreateEventDialog } from "./components/CreateEventDialog";

export default function Schedule() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">Manage your playlists and announcements schedule</p>
        </div>
        <Button 
          onClick={() => setIsCreateEventOpen(true)}
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          + Create Event
        </Button>
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
          customButtons={{
            prev: {
              icon: 'chevron-left',
              click: function(calendar) {
                calendar.prev();
              }
            },
            next: {
              icon: 'chevron-right',
              click: function(calendar) {
                calendar.next();
              }
            }
          }}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          expandRows={true}
          height="auto"
          allDaySlot={false}
          slotDuration="01:00:00"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          nowIndicator={true}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          select={(info) => {
            setIsCreateEventOpen(true);
          }}
        />
      </div>

      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen}
      />
    </div>
  );
}