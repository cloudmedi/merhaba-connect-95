import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

interface DeviceListProps {
  devices: Device[];
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
}

export function DeviceList({ devices, selectedDevices, onToggleDevice }: DeviceListProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
            onClick={() => onToggleDevice(device.id)}
          >
            <Checkbox
              checked={selectedDevices.includes(device.id)}
              onCheckedChange={() => onToggleDevice(device.id)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{device.name}</p>
                <span className={`text-sm ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                  {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>{device.category}</span>
                {device.last_seen && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      Son görülme: {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}