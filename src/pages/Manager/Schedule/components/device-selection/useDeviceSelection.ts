import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDeviceSelection() {
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
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

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: groupsData, error: groupsError } = await supabase
        .from('branch_groups')
        .select(`
          id,
          name,
          description,
          branch_group_assignments (
            branch_id
          )
        `);
      
      if (groupsError) throw groupsError;

      const groupsWithDevices = await Promise.all(groupsData.map(async (group) => {
        const branchIds = group.branch_group_assignments.map((a: any) => a.branch_id);
        
        const { data: devices, error: devicesError } = await supabase
          .from('devices')
          .select('id, name, status')
          .in('branch_id', branchIds);
        
        if (devicesError) throw devicesError;
        
        return {
          ...group,
          devices: devices || []
        };
      }));

      return groupsWithDevices;
    }
  });

  return {
    devices,
    groups,
    isLoadingDevices,
    isLoadingGroups
  };
}