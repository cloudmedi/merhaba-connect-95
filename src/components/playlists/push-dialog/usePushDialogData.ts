import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PushDialogDevice, Group } from "./deviceTypes";

export const usePushDialogData = () => {
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
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

      return data.map(device => ({
        ...device,
        status: device.status === 'online' ? 'online' : 'offline',
        system_info: typeof device.system_info === 'string' 
          ? JSON.parse(device.system_info)
          : device.system_info || {}
      })) as PushDialogDevice[];
    },
  });

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data, error } = await supabase
        .from('branch_groups')
        .select(`
          *,
          branch_group_assignments (
            branches (
              id,
              name,
              devices (
                id,
                name,
                status
              )
            )
          )
        `)
        .eq('company_id', userProfile.company_id);

      if (error) throw error;

      return (data || []).map(group => ({
        ...group,
        branch_group_assignments: group.branch_group_assignments?.map(assignment => ({
          branches: {
            ...assignment.branches,
            devices: assignment.branches?.devices?.map(device => ({
              ...device,
              status: device.status === 'online' ? 'online' : 'offline'
            }))
          }
        }))
      })) as Group[];
    },
  });

  return {
    devices,
    groups,
    isLoadingDevices,
    isLoadingGroups
  };
};