import { ScrollArea } from "@/components/ui/scroll-area";
import { DeviceItem } from "./DeviceItem";

export interface DeviceListProps {
  isLoading: boolean;
  devices: Array<{
    id: string;
    name: string;
    status: string;
    category?: string;
    last_seen?: string;
    branches?: {
      name?: string;
    };
  }>;
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
}

export function DeviceList({ 
  isLoading, 
  devices, 
  selectedDevices, 
  onToggleDevice 
}: DeviceListProps) {
  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>
      ) : devices.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>
      ) : (
        <div className="space-y-4">
          {devices.map((device) => (
            <DeviceItem
              key={device.id}
              device={device}
              isSelected={selectedDevices.includes(device.id)}
              onToggle={() => onToggleDevice(device.id)}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}