import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Monitor } from "lucide-react";
import { Device } from "../types";

interface DeviceListProps {
  devices: Device[];
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
}

export function DeviceList({ devices, selectedDevices, onDevicesChange }: DeviceListProps) {
  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      onDevicesChange(selectedDevices.filter(id => id !== deviceId));
    } else {
      onDevicesChange([...selectedDevices, deviceId]);
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="grid grid-cols-2 gap-4">
        {devices.map((device) => (
          <Card
            key={device.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
              selectedDevices.includes(device.id) ? "border-primary" : ""
            }`}
            onClick={() => toggleDevice(device.id)}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedDevices.includes(device.id)}
                onCheckedChange={() => toggleDevice(device.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-500" />
                  <p className="font-medium">{device.name}</p>
                </div>
                {device.branches?.name && (
                  <p className="text-sm text-gray-500 mt-1">{device.branches.name}</p>
                )}
                <span className={`text-xs mt-2 flex items-center gap-1 ${
                  device.status === 'online' ? 'text-green-500' : 'text-gray-400'
                }`}>
                  ● {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}