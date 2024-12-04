import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Device, DeviceCategory } from "./types";

export const useDevices = () => {
  const queryClient = useQueryClient();
  const presenceChannel = supabase.channel('device_status');
  const broadcastChannel = supabase.channel('device_broadcast');

  const validateDeviceCategory = (category: string): DeviceCategory => {
    const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
    return validCategories.includes(category as DeviceCategory) 
      ? (category as DeviceCategory) 
      : 'player';
  };

  useEffect(() => {
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        console.log('Device presence state:', presenceState);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const device = newPresences[0];
        console.log('Device joined:', device);
        toast.success(`Device ${device.token} is now online`);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const device = leftPresences[0];
        console.log('Device left:', device);
        toast.warning(`Device ${device.token} is now offline`);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [queryClient]);

  const { data: devices = [], isLoading, error } = useQuery({
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
            name,
            company_id
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) throw error;
      
      const presenceState = presenceChannel.presenceState();
      
      const devicesWithStatus = data.map(device => ({
        ...device,
        status: Object.values(presenceState)
          .flat()
          .some((p: any) => p.token === device.token) ? 'online' : 'offline',
        category: validateDeviceCategory(device.category)
      })) as Device[];
      
      return devicesWithStatus;
    },
  });

  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      const { data, error } = await supabase
        .from('devices')
        .insert({
          ...device,
          last_seen: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Broadcast to device to check its status
      await broadcastChannel.send({
        type: 'broadcast',
        event: 'status_check',
        payload: { token: device.token }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add device: ' + error.message);
    },
  });

  return {
    devices,
    isLoading,
    error,
    createDevice
  };
};