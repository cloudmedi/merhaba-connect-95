import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DeviceItem } from "./DeviceItem";

interface DeviceListProps {
  searchQuery: string;
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
}

export function DeviceList({ searchQuery, selectedDevices, onToggleDevice }: DeviceListProps) {
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
      return data;
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>;
  }

  if (filteredDevices.length === 0) {
    return <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>;
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {filteredDevices.map((device) => (
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