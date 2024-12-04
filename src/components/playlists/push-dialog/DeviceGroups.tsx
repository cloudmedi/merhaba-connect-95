import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  devices: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

interface DeviceGroupsProps {
  selectedDevices: string[];
  onDeviceToggle: (deviceId: string) => void;
}

export function DeviceGroups({ selectedDevices, onDeviceToggle }: DeviceGroupsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: groups, isLoading } = useQuery({
    queryKey: ['device-groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('No company associated with user');

      const { data, error } = await supabase
        .from('branch_groups')
        .select(`
          id,
          name,
          description,
          branch_group_assignments (
            branches (
              devices (
                id,
                name,
                status
              )
            )
          )
        `)
        .eq('company_id', profile.company_id);

      if (error) throw error;

      // Transform the data to match our DeviceGroup interface
      return data.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        devices: group.branch_group_assignments
          .flatMap(assignment => assignment.branches?.devices || [])
      }));
    }
  });

  const handleGroupSelect = (groupDevices: Array<{ id: string }>) => {
    const deviceIds = groupDevices.map(d => d.id);
    const allSelected = deviceIds.every(id => selectedDevices.includes(id));
    
    if (allSelected) {
      // Remove all devices in this group
      deviceIds.forEach(id => onDeviceToggle(id));
    } else {
      // Add all devices in this group
      deviceIds.forEach(id => {
        if (!selectedDevices.includes(id)) {
          onDeviceToggle(id);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-500">Loading groups...</div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-2 gap-3 p-1">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="flex flex-col p-4 rounded-lg border hover:bg-accent cursor-pointer"
            onClick={() => handleGroupSelect(group.devices)}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={group.devices.every(device => 
                  selectedDevices.includes(device.id)
                )}
                onCheckedChange={() => handleGroupSelect(group.devices)}
              />
              <div>
                <p className="font-medium text-sm">{group.name}</p>
                {group.description && (
                  <p className="text-xs text-gray-500">{group.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {group.devices.length} devices
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}