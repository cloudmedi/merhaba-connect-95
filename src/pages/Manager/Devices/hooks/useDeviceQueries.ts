import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Device } from "./types";

export function useDeviceQueries() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      // First get the user's profile and company_id
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!userProfile?.company_id) {
        return [];
      }

      // Then fetch devices with proper join
      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name,
            company_id
          ),
          schedule_device_assignments (
            schedule:schedule_events (
              id,
              title
            )
          ),
          playlist_assignments:playlists (
            id,
            name
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }

      // Transform the data to match the Device type
      return (data || []).map(device => ({
        ...device,
        system_info: typeof device.system_info === 'string' 
          ? JSON.parse(device.system_info) 
          : device.system_info || {},
        schedule: typeof device.schedule === 'string'
          ? JSON.parse(device.schedule)
          : device.schedule || {},
        schedule_device_assignments: Array.isArray(device.schedule_device_assignments)
          ? device.schedule_device_assignments.map(assignment => ({
              schedule: assignment.schedule
            }))
          : [],
        playlist_assignments: Array.isArray(device.playlist_assignments)
          ? device.playlist_assignments.map(playlist => ({
              playlist: {
                id: playlist.id,
                name: playlist.name
              }
            }))
          : []
      })) as Device[];
    },
  });
}