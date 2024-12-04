import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

interface DeviceSelectionProps {
  devices: Device[];
  selectedDevices: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setSelectedDevices: (value: string[]) => void;
}

export function DeviceSelection({ 
  devices, 
  selectedDevices, 
  searchQuery, 
  setSearchQuery, 
  setSelectedDevices 
}: DeviceSelectionProps) {
  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cihaz ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={handleSelectAll}
          className="whitespace-nowrap"
        >
          {selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
        </Button>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => {
                setSelectedDevices(prev => 
                  prev.includes(device.id) 
                    ? prev.filter(id => id !== device.id)
                    : [...prev, device.id]
                );
              }}
            >
              <Checkbox
                checked={selectedDevices.includes(device.id)}
                onCheckedChange={() => {
                  setSelectedDevices(prev => 
                    prev.includes(device.id) 
                      ? prev.filter(id => id !== device.id)
                      : [...prev, device.id]
                  );
                }}
              />
              <div>
                <p className="font-medium text-sm">{device.name}</p>
                {device.branches?.name && (
                  <p className="text-sm text-gray-500">{device.branches.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}