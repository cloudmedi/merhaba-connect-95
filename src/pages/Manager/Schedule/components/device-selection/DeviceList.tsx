import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Monitor } from "lucide-react";

interface DeviceListProps {
  devices: any[];
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
}

export function DeviceList({ devices, selectedDevices, onToggleDevice }: DeviceListProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-2 gap-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
            onClick={() => onToggleDevice(device.id)}
          >
            <Checkbox
              checked={selectedDevices.includes(device.id)}
              onCheckedChange={() => onToggleDevice(device.id)}
            />
            <div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-medium">{device.name}</h4>
              </div>
              <p className="text-sm text-gray-500">
                {device.status === 'online' ? 
                  <span className="text-green-600">● Online</span> : 
                  <span className="text-gray-400">● Offline</span>
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}