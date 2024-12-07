import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DeviceItem } from "./DeviceItem";
import { ScrollArea } from "@/components/ui/scroll-area";

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

      if (!userProfile?.company_id) {
        return [];
      }

      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name
          ),
          schedule_device_assignments (
            schedule:schedule_events (
              id,
              title
            )
          ),
          playlist_assignments (
            playlist:playlists (
              id,
              name
            )
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

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>
      ) : (
        <div className="space-y-4">
          {filteredDevices.map((device) => (
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