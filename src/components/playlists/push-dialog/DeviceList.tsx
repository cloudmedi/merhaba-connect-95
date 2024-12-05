import { ScrollArea } from "@/components/ui/scroll-area";
import { PushDialogDevice } from "./types";
import { DeviceItem } from "./DeviceItem";

interface DeviceListProps {
  devices: PushDialogDevice[];
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
  isLoading?: boolean;
}

export function DeviceList({ devices, selectedDevices, onToggleDevice, isLoading }: DeviceListProps) {
  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>;
  }

  if (devices.length === 0) {
    return <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>;
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {devices.map((device) => (
          <DeviceItem
            key={device.id}
            device={device}
            isSelected={selectedDevices.includes(device.id)}
            onToggle={onToggleDevice}
          />
        ))}
      </div>
    </ScrollArea>
  );
}