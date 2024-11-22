import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Device } from "./types";
import { useAuth } from "@/hooks/useAuth";

export const useDevices = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
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
      
      // Cast the response to match our Device type
      return (data as Device[]) || [];
    },
    enabled: !!user?.id
  });

  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!userProfile?.company_id) {
        throw new Error('No company associated with user');
      }

      const { data, error } = await supabase
        .from('devices')
        .insert({
          ...device,
          last_seen: new Date().toISOString(),
          ip_address: window.location.hostname,
          system_info: { health: 'healthy', ...device.system_info },
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
      toast.error('Failed to add device: ' + error.message);
    }
  });

  return {
    devices,
    isLoading,
    error,
    createDevice
  };
};