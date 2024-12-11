import { Signal, AlertTriangle, Monitor, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { Device } from "../hooks/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface DeviceInfoProps {
  device: Device;
}

export function DeviceInfo({ device }: DeviceInfoProps) {
  const lastSeen = device.last_seen 
    ? formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })
    : 'Hiç bağlanmadı';

  const getStatusIcon = () => {
    if (device.status === 'online') return <Signal className="h-4 w-4 text-emerald-500" />;
    if (device.system_info?.health === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <Monitor className="h-4 w-4 text-gray-400" />;
  };

  const currentPlaylist = device.playlist_assignments?.[0]?.playlist?.name;

  return (
    <>
      <TableCell className="w-[40px]">
        {getStatusIcon()}
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <p className="font-medium text-gray-900">{device.name}</p>
          <p className="text-sm text-gray-500">{device.branches?.name || 'Şube atanmamış'}</p>
          {currentPlaylist && (
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <PlayCircle className="h-3 w-3" />
              <span>{currentPlaylist}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={device.status === 'online' ? 'success' : 'secondary'}
          className={device.status === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}
        >
          {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-500">
        {lastSeen}
      </TableCell>
    </>
  );
}