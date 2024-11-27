import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Device } from "./types";

export const useDevices = () => {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
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
          
          if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old?.status;
            const newStatus = payload.new?.status;
            const deviceName = payload.new?.name;
            
            if (oldStatus !== newStatus) {
              if (newStatus === 'online') {
                toast.success(`${deviceName} çevrimiçi oldu`);
              } else if (newStatus === 'offline') {
                toast.warning(`${deviceName} çevrimdışı oldu`);
              }
            }
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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Oturum açmış kullanıcı bulunamadı');
        }

        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error('Kullanıcı profili yüklenirken hata oluştu');
        }

        if (!userProfile?.company_id) {
          throw new Error('Kullanıcı bir şirkete atanmamış');
        }

        const { data, error: devicesError } = await supabase
          .from('devices')
          .select(`
            *,
            branches (
              id,
              name,
              company_id
            )
          `)
          .or(`branch_id.is.null,branches.company_id.eq.${userProfile.company_id}`);

        if (devicesError) {
          throw devicesError;
        }

        return data || [];
      } catch (error) {
        console.error('Cihazlar yüklenirken hata:', error);
        throw error;
      }
    },
    retry: 1,
  });

  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı');

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!userProfile?.company_id) {
        throw new Error('Kullanıcı bir şirkete atanmamış');
      }

      const { data, error } = await supabase
        .from('devices')
        .insert({
          ...device,
          last_seen: new Date().toISOString(),
          ip_address: window.location.hostname,
          company_id: userProfile.company_id
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