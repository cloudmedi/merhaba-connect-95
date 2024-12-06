import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Device, DeviceCategory } from "./types";

export const useDevices = () => {
  const queryClient = useQueryClient();
  const presenceChannel = supabase.channel('device_status');

  useEffect(() => {
    // Subscribe to device presence channel
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        console.log('Device presence state:', presenceState);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Device joined:', key, newPresences);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        toast.success(`Device ${newPresences[0]?.token} is now online`);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Device left:', key, leftPresences);
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        toast.warning(`Device ${leftPresences[0]?.token} is now offline`);
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
          table: 'devices',
          filter: `status=in.(online,offline)`
        },
        (payload) => {
          console.log('Device change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['devices'] });
          
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            const deviceName = payload.new.name;
            
            if (newStatus === 'online') {
              toast.success(`${deviceName} is now online`);
            } else if (newStatus === 'offline') {
              toast.warning(`${deviceName} is now offline`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
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
        .eq('created_by', userData.user.id);

      if (error) throw error;
      
      // Get presence state to determine online status
      const presenceState = presenceChannel.presenceState();
      console.log('Current presence state:', presenceState);
      
      // Update device status based on presence and database status
      const devicesWithStatus = data.map(device => ({
        ...device,
        status: Object.values(presenceState)
          .flat()
          .some((p: any) => p.token === device.token) ? 'online' : device.status
      })) as Device[];
      
      console.log('Devices with status:', devicesWithStatus);
      return devicesWithStatus;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  return {
    devices,
    isLoading,
    error
  };
};