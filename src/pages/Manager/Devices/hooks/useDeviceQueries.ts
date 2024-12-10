import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Device } from "./types";

export const useDeviceQueries = () => {
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
          playlist_assignments (
            playlist:playlists (
              id,
              name
            )
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }

      return (data as Device[]) || [];
    },
  });
};