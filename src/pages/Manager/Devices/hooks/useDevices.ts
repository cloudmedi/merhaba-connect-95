import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceSubscription } from "./useDeviceSubscription";
import type { Device } from "./types";

export const useDevices = () => {
  const queryClient = useQueryClient();
  
  // Set up realtime subscription
  useDeviceSubscription(queryClient);

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

      if (error) {
        toast.error('Cihazlar yüklenirken bir hata oluştu');
        throw error;
      }

      return data as Device[];
    },
  });

  return {
    devices,
    isLoading,
    error
  };
};