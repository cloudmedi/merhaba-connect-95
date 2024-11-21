import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Device {
  id: string;
  name: string;
  branch_id: string | null;
  category: 'player' | 'display' | 'controller';
  status: 'online' | 'offline';
  ip_address?: string | null;
  system_info: {
    os?: string;
    memory?: string;
    storage?: string;
    version?: string;
  };
  schedule: {
    powerOn?: string;
    powerOff?: string;
  };
  last_seen?: string | null;
  created_at?: string;
  updated_at?: string;
  branch?: {
    name: string;
    location: string;
  } | null;
}

export const useDevices = () => {
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branch:branches(
            name,
            location
          )
        `);

      if (error) throw error;
      
      // Transform the data to match our Device type
      return data.map((device: any) => ({
        ...device,
        category: device.category as 'player' | 'display' | 'controller',
        status: device.status as 'online' | 'offline',
        system_info: device.system_info || {},
        schedule: device.schedule || {}
      })) as Device[];
    },
  });

  // Create device
  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      const { data, error } = await supabase
        .from('devices')
        .insert(device)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add device');
      console.error('Error adding device:', error);
    },
  });

  // Update device
  const updateDevice = useMutation({
    mutationFn: async ({ id, ...device }: Partial<Device> & { id: string }) => {
      const { data, error } = await supabase
        .from('devices')
        .update(device)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update device');
      console.error('Error updating device:', error);
    },
  });

  // Delete device
  const deleteDevice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete device');
      console.error('Error deleting device:', error);
    },
  });

  return {
    devices,
    isLoading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
  };
};
