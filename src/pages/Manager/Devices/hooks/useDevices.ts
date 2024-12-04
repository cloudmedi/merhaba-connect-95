import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Device } from "./types";

export const useDevices = () => {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    // Subscribe to device presence channel
    const presenceChannel = supabase.channel('device_presence')
      .on(
        'presence',
        { event: 'sync' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['devices'] });
        }
      )
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresences }) => {
          queryClient.invalidateQueries({ queryKey: ['devices'] });
          toast.success(`Device ${key} is now online`);
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        ({ key, leftPresences }) => {
          queryClient.invalidateQueries({ queryKey: ['devices'] });
          toast.warning(`Device ${key} is now offline`);
        }
      )
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
      
      // Type assertion to ensure the response matches our Device type
      return (data as unknown as Device[]) || [];
    },
  });

  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      const { data, error } = await supabase
        .from('devices')
        .insert({
          ...device,
          last_seen: new Date().toISOString(),
          ip_address: window.location.hostname,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Cihaz başarıyla eklendi');
    },
    onError: (error: Error) => {
      toast.error('Cihaz eklenirken bir hata oluştu: ' + error.message);
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

  return {
    devices,
    isLoading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
  };
};