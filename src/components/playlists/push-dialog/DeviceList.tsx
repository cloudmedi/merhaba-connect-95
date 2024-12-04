import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Device } from "@/pages/Manager/Devices/hooks/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface DeviceListProps {
  devices: Device[];
  selectedDevices: string[];
  onDeviceToggle: (deviceId: string) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading?: boolean;
}

export function DeviceList({ 
  devices, 
  selectedDevices, 
  onDeviceToggle, 
  onSelectAll,
  isLoading = false 
}: DeviceListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const areAllSelected = filteredDevices.length > 0 && 
    filteredDevices.every(device => selectedDevices.includes(device.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-gray-500">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <button
          onClick={() => onSelectAll(!areAllSelected)}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          {areAllSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-3 p-1">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => onDeviceToggle(device.id)}
            >
              <Checkbox
                checked={selectedDevices.includes(device.id)}
                onCheckedChange={() => onDeviceToggle(device.id)}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{device.name}</h4>
                  <Badge 
                    variant={device.status === 'online' ? 'success' : 'secondary'}
                    className="ml-2"
                  >
                    {device.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {device.category}
                </p>
                {device.last_seen && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last seen: {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          ))}
          {filteredDevices.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No devices found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}