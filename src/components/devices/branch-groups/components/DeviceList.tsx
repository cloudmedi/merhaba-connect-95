import { Checkbox } from "@/components/ui/checkbox";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

interface DeviceListProps {
  devices: Device[];
  selectedDevices: Set<string>;
  onDeviceSelect: (deviceId: string) => void;
}

export function DeviceList({ devices, selectedDevices, onDeviceSelect }: DeviceListProps) {
  return (
    <div className="p-4 space-y-2">
      {devices.map((device) => (
        <div key={device.id} className="flex items-center space-x-2">
          <Checkbox
            id={device.id}
            checked={selectedDevices.has(device.id)}
            onCheckedChange={() => onDeviceSelect(device.id)}
          />
          <label htmlFor={device.id} className="text-sm">
            {device.name}
          </label>
        </div>
      ))}
    </div>
  );
}