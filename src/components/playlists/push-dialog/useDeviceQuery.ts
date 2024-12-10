import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DeviceCategory } from "@/pages/Manager/Devices/hooks/types";
import type { PushDialogDevice } from "./types";

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
            name,
            company_id
          )
        `)
        .eq('created_by', userData.user.id);

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }

      // Ensure category is of type DeviceCategory
      return (data || []).map(device => ({
        ...device,
        category: validateDeviceCategory(device.category)
      })) as PushDialogDevice[];
    },
  });
}

// Helper function to validate device category
function validateDeviceCategory(category: string): DeviceCategory {
  const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
  return validCategories.includes(category as DeviceCategory) 
    ? (category as DeviceCategory) 
    : 'player'; // Default to 'player' if invalid category
}