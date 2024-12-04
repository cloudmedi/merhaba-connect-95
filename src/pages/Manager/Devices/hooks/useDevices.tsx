import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Device, DeviceCategory } from "./types";

export const useDevices = () => {
  const queryClient = useQueryClient();
  const presenceChannel = supabase.channel('device_status');
  const broadcastChannel = supabase.channel('device_broadcast');

  // Set up realtime subscription
  useEffect(() => {
    // Subscribe to device presence channel
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        console.log('Device presence state:', presenceState);
        
        // Update devices when presence changes
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const device = newPresences[0];
        toast.success(`Device ${device.token} is now online`);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const device = leftPresences[0];
        toast.warning(`Device ${device.token} is now offline`);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .subscribe();

    // Also subscribe to direct database changes
    const channel = supabase
      .channel('device_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload) => {
          console.log('Device change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['devices'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      
      // Get presence state to determine online status
      const presenceState = presenceChannel.presenceState();
      
      // Update device status based on presence and ensure category is of correct type
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

  const updateDevice = useMutation({
    mutationFn: async ({ id, ...device }: Partial<Device> & { id: string }) => {
      const { data, error } = await supabase
        .from('devices')
        .update({
          ...device,
          last_seen: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Cihaz başarıyla güncellendi');
    },
    onError: (error: Error) => {
      toast.error('Cihaz güncellenirken bir hata oluştu: ' + error.message);
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
      toast.success('Cihaz başarıyla silindi');
    },
    onError: (error: Error) => {
      toast.error('Cihaz silinirken bir hata oluştu: ' + error.message);
    },
  });

  // Helper function to validate device category
  const validateDeviceCategory = (category: string): DeviceCategory => {
    const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
    return validCategories.includes(category as DeviceCategory) 
      ? (category as DeviceCategory) 
      : 'player'; // Default to 'player' if invalid category
  };

  return {
    devices,
    isLoading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
  };
};