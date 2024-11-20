import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCategory } from "../types";

interface EventDetailsStepProps {
  formData: {
    title: string;
    playlistId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    category: EventCategory;
  };
  onFormDataChange: (data: Partial<EventDetailsStepProps['formData']>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function EventDetailsStep({ formData, onFormDataChange, onNext, onCancel }: EventDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Event Title</Label>
        <Input
          placeholder="Enter event title"
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Event Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value: EventCategory) => onFormDataChange({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Special Promotion">Special Promotion</SelectItem>
            <SelectItem value="Holiday Music">Holiday Music</SelectItem>
            <SelectItem value="Regular Playlist">Regular Playlist</SelectItem>
            <SelectItem value="Background Music">Background Music</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Select Playlist</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search playlists..."
            className="pl-10"
            value={formData.playlistId}
            onChange={(e) => onFormDataChange({ playlistId: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => onFormDataChange({ startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => onFormDataChange({ startTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => onFormDataChange({ endDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => onFormDataChange({ endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
          disabled={!formData.title || !formData.playlistId || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime}
        >
          Next
        </Button>
      </div>
    </div>
  );
}