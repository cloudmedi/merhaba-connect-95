import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { PlaybackSettings } from "./PlaybackSettings";

interface AnnouncementFileProps {
  file: {
    id: string;
    file: File;
    playbackType: "immediate" | "smooth";
    interval?: number;
    songInterval?: number;
    scheduledTime?: string;
  };
  onRemove: () => void;
  onUpdateSettings: (settings: Partial<typeof file>) => void;
}

export function AnnouncementFile({ file, onRemove, onUpdateSettings }: AnnouncementFileProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-medium">{file.file.name}</p>
          <p className="text-sm text-gray-500">
            {(file.file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <PlaybackSettings
        settings={file}
        onUpdate={onUpdateSettings}
      />
    </div>
  );
}