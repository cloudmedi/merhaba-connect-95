import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
  token?: string;
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

  // Set up real-time subscription with improved error handling
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
          console.log('Received real-time update:', payload);
          
          // Invalidate and refetch devices query
          queryClient.invalidateQueries({ queryKey: ['devices'] });
          
          // Show toast notification based on the event
          const event = payload.eventType;
          const deviceName = (payload.new as Device)?.name || (payload.old as Device)?.name;
          
          if (event === 'INSERT') {
            toast.success(`Device "${deviceName}" has been added`);
          } else if (event === 'UPDATE') {
            // Only show status change notifications
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
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIPTION_ERROR') {
          toast.error('Failed to connect to real-time updates');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      console.log('Fetching devices...');
      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branch:branches(
            name,
            location
          )
        `);

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }
      
      console.log('Fetched devices:', data);
      return data as Device[];
    },
  });

  // Create device with improved error handling
  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      console.log('Creating device:', device);
      const { data, error } = await supabase
        .from('devices')
        .insert({
          ...device,
          last_seen: new Date().toISOString(),
          ip_address: window.location.hostname, // Default to client IP for demo
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating device:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: (error) => {
      toast.error('Failed to add device');
      console.error('Error adding device:', error);
    },
  });

  // Update device with improved error handling
  const updateDevice = useMutation({
    mutationFn: async ({ id, ...device }: Partial<Device> & { id: string }) => {
      console.log('Updating device:', id, device);
      const { data, error } = await supabase
        .from('devices')
        .update({
          ...device,
          last_seen: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating device:', error);
        throw error;
      }
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

  // Delete device with improved error handling
  const deleteDevice = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting device:', id);
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting device:', error);
        throw error;
      }
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