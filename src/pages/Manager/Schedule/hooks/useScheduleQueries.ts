import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DatabaseScheduleEvent } from "../types/scheduleTypes";
import { mapDatabaseToScheduleEvent } from "../utils/eventMappers";

export function useScheduleQueries() {
  return useQuery({
    queryKey: ['schedule-events'],
    queryFn: async () => {
      console.log('🔍 Fetching schedule events...');
      
      const { data: userData } = await supabase.auth.getUser();
      console.log('👤 Current user:', userData);
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userData.user?.id)
        .single();

      console.log('🏢 User profile:', userProfile);

      const { data, error } = await supabase
        .from('schedule_events')
        .select(`
          *,
          playlists (
            id,
            name,
            artwork_url
          ),
          devices:schedule_device_assignments(
            device_id
          )
        `)
        .eq('company_id', userProfile?.company_id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching events:', error);
        throw error;
      }

      console.log('📊 Raw events from database:', data);
      const mappedEvents = (data as DatabaseScheduleEvent[]).map(mapDatabaseToScheduleEvent);
      console.log('🎯 Mapped events:', mappedEvents);
      return mappedEvents;
    },
  });
}