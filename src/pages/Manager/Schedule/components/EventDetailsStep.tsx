import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

interface EventDetailsStepProps {
  eventData: {
    title: string;
    playlist: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  setEventData: (data: any) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function EventDetailsStep({ eventData, setEventData, onNext, onCancel }: EventDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Event Title</Label>
        <Input
          placeholder="Enter event title"
          value={eventData.title}
          onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Select Playlist</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search playlists..."
            className="pl-10"
            value={eventData.playlist}
            onChange={(e) => setEventData({ ...eventData, playlist: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={eventData.startDate}
            onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input
            type="time"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={eventData.endDate}
            onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input
            type="time"
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onNext} className="bg-[#6E59A5] hover:bg-[#5a478a] text-white">
          Next
        </Button>
      </div>
    </div>
  );
}