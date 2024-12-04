import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlaylistSelectionDialog } from "./PlaylistSelectionDialog";

interface EventDetailsStepProps {
  formData: {
    title: string;
    playlistId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  onFormDataChange: (data: Partial<EventDetailsStepProps['formData']>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function EventDetailsStep({ formData, onFormDataChange, onNext, onCancel }: EventDetailsStepProps) {
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  const handlePlaylistSelect = (playlist: any) => {
    setSelectedPlaylist(playlist);
    onFormDataChange({ playlistId: playlist.id });
  };

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
        <Label>Select Playlist</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => setIsPlaylistDialogOpen(true)}
          >
            {selectedPlaylist ? selectedPlaylist.name : "Choose a playlist..."}
          </Button>
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

      <PlaylistSelectionDialog
        open={isPlaylistDialogOpen}
        onOpenChange={setIsPlaylistDialogOpen}
        onPlaylistSelect={handlePlaylistSelect}
      />
    </div>
  );
}