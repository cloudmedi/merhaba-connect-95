import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Json } from "@/integrations/supabase/types/json";

export interface Device {
  id: string;
  name: string;
  category: 'player' | 'display' | 'controller';
  status: 'online' | 'offline';
  ip_address?: string | null;
  system_info: Json;
  schedule: Json;
  token?: string;
  last_seen?: string | null;
  created_at?: string;
  updated_at?: string;
  location?: string | null;
  branch_id?: string | null;
  branches?: {
    id: string;
    name: string;
    company_id: string | null;
  } | null;
}

export const useDevices = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('devices_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload: RealtimePostgresChangesPayload<Device>) => {
          queryClient.invalidateQueries({ queryKey: ['devices'] });
          
          const event = payload.eventType;
          const deviceName = (payload.new as Device)?.name || (payload.old as Device)?.name;
          
          if (event === 'INSERT') {
            toast.success(`Device "${deviceName}" has been added`);
          } else if (event === 'UPDATE') {
            const oldStatus = (payload.old as Device)?.status;
            const newStatus = (payload.new as Device)?.status;
            if (oldStatus !== newStatus) {
              toast.info(`Device "${deviceName}" is now ${newStatus}`);
            }
          } else if (event === 'DELETE') {
            toast.success(`Device "${deviceName}" has been removed`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*, licenses(*)')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data: devices, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name,
            company_id
          )
        `)
        .eq('branches.company_id', userProfile?.company_id);

      if (error) throw error;
      return devices || [];
    },
  });

  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      // First check license limit
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*, licenses(*)')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const licenseQuantity = userProfile?.licenses?.[0]?.quantity || 0;
      
      // Count current devices
      const { count: currentDevices } = await supabase
        .from('devices')
        .select('*', { count: 'exact' })
        .eq('branch_id', device.branch_id);

      if (currentDevices !== null && currentDevices >= licenseQuantity) {
        throw new Error(`License limit reached (${licenseQuantity} devices). Please upgrade your license to add more devices.`);
      }

      const { data, error } = await supabase
        .from('devices')
        .insert({
          ...device,
          last_seen: new Date().toISOString(),
          ip_address: window.location.hostname,
          system_info: device.system_info || {},
          schedule: device.schedule || {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateDevice = useMutation({
    mutationFn: async ({ id, ...device }: Partial<Device> & { id: string }) => {
      const { data, error } = await supabase
        .from('devices')
        .update({
          ...device,
          last_seen: new Date().toISOString(),
          system_info: device.system_info || undefined,
          schedule: device.schedule || undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: (error) => {
      toast.error('Failed to update device');
      console.error('Error updating device:', error);
    },
  });

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