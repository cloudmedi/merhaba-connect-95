import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { PlayCircle, Calendar } from "lucide-react";

interface DeviceItemProps {
  device: {
    id: string;
    name: string;
    status: string;
    category?: string;
    last_seen?: string;
    branches?: {
      name?: string;
    };
    schedule_device_assignments?: Array<{
      schedule?: {
        title?: string;
      };
    }>;
    playlist_assignments?: Array<{
      playlist?: {
        name?: string;
      };
    }>;
  };
  isSelected: boolean;
  onToggle: (deviceId: string) => void;
}

export function DeviceItem({ device, isSelected, onToggle }: DeviceItemProps) {
  const currentSchedule = device.schedule_device_assignments?.[0]?.schedule?.title;
  const currentPlaylist = device.playlist_assignments?.[0]?.playlist?.name;

  return (
    <div
      className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
      onClick={() => onToggle(device.id)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(device.id)}
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{device.name}</p>
          <Badge 
            variant={device.status === 'online' ? 'success' : 'secondary'}
            className="ml-2"
          >
            {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          {device.branches?.name && (
            <>
              <span>{device.branches.name}</span>
              <span>•</span>
            </>
          )}
          <span>{device.category}</span>
          {device.last_seen && (
            <>
              <span>•</span>
              <span>
                Son görülme: {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })}
              </span>
            </>
          )}
        </div>
        {(currentPlaylist || currentSchedule) && (
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
            {currentPlaylist && (
              <div className="flex items-center gap-1">
                <PlayCircle className="h-3 w-3" />
                <span>{currentPlaylist}</span>
              </div>
            )}
            {currentSchedule && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{currentSchedule}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}