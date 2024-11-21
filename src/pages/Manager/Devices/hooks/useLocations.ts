import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLocations = () => {
  return useQuery({
    queryKey: ['device-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('location')
        .not('location', 'is', null)
        .order('location');

      if (error) throw error;

      // Get unique locations and remove nulls
      const uniqueLocations = [...new Set(data.map(d => d.location).filter(Boolean))];
      return uniqueLocations;
    }
  });
};