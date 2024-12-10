import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDeviceQuery() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.log('No user found');
        return [];
      }

      console.log('User ID:', userData.user.id);
      
      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name
          )
        `)
        .eq('created_by', userData.user.id);

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }

      console.log('Fetched devices:', data);
      return data || [];
    },
  });
}