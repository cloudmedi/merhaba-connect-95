import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Monitor } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface DeviceSelectionStepProps {
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DeviceSelectionStep({ 
  selectedDevices, 
  onDevicesChange,
  onNext,
  onBack 
}: DeviceSelectionStepProps) {
  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSelectAll = () => {
    if (selectedDevices.length === devices.length) {
      onDevicesChange([]);
    } else {
      onDevicesChange(devices.map(device => device.id));
    }
  };

  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      onDevicesChange(selectedDevices.filter(id => id !== deviceId));
    } else {
      onDevicesChange([...selectedDevices, deviceId]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cihaz ara..."
            className="pl-10"
          />
        </div>
        <Button 
          variant="link" 
          onClick={handleSelectAll}
          className="ml-4"
        >
          {selectedDevices.length === devices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => toggleDevice(device.id)}
            >
              <Checkbox
                checked={selectedDevices.includes(device.id)}
                onCheckedChange={() => toggleDevice(device.id)}
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Geri
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedDevices.length === 0}
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          İleri
        </Button>
      </div>
    </div>
  );
}