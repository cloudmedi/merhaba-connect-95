import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DeviceListProps {
  devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-2">Henüz kayıtlı cihaz bulunmuyor</p>
        <p className="text-sm text-gray-400">Yeni bir cihaz ekleyerek başlayın</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-480px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {devices.map((device) => (
          <DeviceListItem key={device.id} device={device} />
        ))}
      </div>
    </ScrollArea>
  );
}