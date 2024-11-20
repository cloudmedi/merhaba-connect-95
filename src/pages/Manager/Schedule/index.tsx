import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Schedule() {
  const [events, setEvents] = useState([
    {
      title: "Pop Music Playlist",
      start: "2024-02-20T10:00:00",
      end: "2024-02-20T16:00:00",
    },
    {
      title: "Jazz Evening",
      start: "2024-02-21T18:00:00",
      end: "2024-02-21T23:00:00",
    },
  ]);

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Please enter event title');
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        }
      ]);
    }
  };

  return (
    <DashboardLayout
      title="Schedule"
      description="Manage your music schedules and calendar events"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Music Schedule</h2>
          <p className="text-muted-foreground">Plan and manage your music playlists schedule</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="h-[800px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            height="100%"
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
              startTime: '06:00',
              endTime: '24:00',
            }}
          />
        </div>
      </Card>
    </DashboardLayout>
  );
}