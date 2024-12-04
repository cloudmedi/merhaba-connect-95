import { Device } from "@/pages/Manager/Devices/hooks/types";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface DeviceItemProps {
  device: Device;
  isSelected: boolean;
  onToggle: (deviceId: string) => void;
}

export function DeviceItem({ device, isSelected, onToggle }: DeviceItemProps) {
  return (
    <div
      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onToggle(device.id)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(device.id)}
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
  );
}