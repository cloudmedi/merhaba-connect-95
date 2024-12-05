import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

interface DeviceSelectionProps {
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
}

export function DeviceSelection({ selectedDevices, onDevicesChange }: DeviceSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) throw error;
      return data as Device[];
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      onDevicesChange([]);
    } else {
      onDevicesChange(filteredDevices.map(d => d.id));
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
                onDevicesChange(
                  selectedDevices.includes(device.id)
                    ? selectedDevices.filter(id => id !== device.id)
                    : [...selectedDevices, device.id]
                );
              }}
            >
              <Checkbox
                checked={selectedDevices.includes(device.id)}
                onCheckedChange={() => {
                  onDevicesChange(
                    selectedDevices.includes(device.id)
                      ? selectedDevices.filter(id => id !== device.id)
                      : [...selectedDevices, device.id]
                  );
                }}
              />
              <div>
                <p className="font-medium text-sm">{device.name}</p>
                {device.branches?.name && (
                  <p className="text-sm text-gray-500">{device.branches.name}</p>
                )}
                <span className={`text-xs ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                  ● {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}