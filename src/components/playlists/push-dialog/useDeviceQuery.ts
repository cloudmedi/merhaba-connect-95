import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { DeviceCategory } from "@/pages/Manager/Devices/hooks/types";
import type { PushDialogDevice } from "./types";

export function useDeviceQuery() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      console.log('Fetching devices...');
      
      const { data } = await api.get('/admin/devices');
      
      // Ensure category is of type DeviceCategory
      return (data || []).map((device: any) => ({
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