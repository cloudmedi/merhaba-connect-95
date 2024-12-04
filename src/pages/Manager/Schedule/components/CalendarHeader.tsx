import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScheduleEvent } from "../types/scheduleTypes";

interface CalendarHeaderProps {
  onCreateEvent: () => void;
  onExport: (events: ScheduleEvent[], format: 'ics' | 'csv') => void;
  events: ScheduleEvent[];
}

export function CalendarHeader({ onCreateEvent, onExport, events }: CalendarHeaderProps) {
  return (
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
            <DropdownMenuItem onClick={() => onExport(events, 'ics')}>
              Export as ICS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(events, 'csv')}>
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={onCreateEvent}
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          + Create Event
        </Button>
      </div>
    </div>
  );
}