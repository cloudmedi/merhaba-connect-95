import { ScrollArea } from "@/components/ui/scroll-area";
import { Device } from "@/pages/Manager/Devices/hooks/types";
import { DeviceItem } from "./DeviceItem";

interface DeviceListProps {
  devices: Device[];
  selectedTokens: string[];
  onToggleDevice: (token: string | undefined) => void;
  isLoading: boolean;
}

export function DeviceList({ 
  devices, 
  selectedTokens, 
  onToggleDevice,
  isLoading 
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
              isSelected={selectedTokens.includes(device.token || '')}
              onToggle={() => onToggleDevice(device.token)}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}