import { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface CalendarViewProps {
  events: any[];
  onEventDrop: (info: any) => void;
  onSelect: (selectInfo: any) => void;
}

export function CalendarView({ events, onEventDrop, onSelect }: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Calendar container mounted:", containerRef.current);
    console.log("Calendar events:", events);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      console.log("Calendar instance:", calendarRef.current.getApi());
    }
  }, [calendarRef.current]);

  return (
    <div ref={containerRef} className="calendar-container h-[600px]">
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
            height: 100%;
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

          .calendar-container {
            width: 100%;
            min-height: 600px;
            position: relative;
          }
        `}
      </style>
      
      <FullCalendar
        ref={calendarRef}
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
        height="100%"
        allDaySlot={false}
        slotDuration="01:00:00"
        editable={true}
        droppable={true}
        eventDrop={onEventDrop}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        events={events}
        select={onSelect}
        eventDidMount={(info) => {
          console.log("Event mounted:", info.event.title);
        }}
      />
    </div>
  );
}