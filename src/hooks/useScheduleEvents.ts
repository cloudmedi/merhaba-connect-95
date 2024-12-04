import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DatabaseScheduleEvent, ScheduleEvent } from "@/pages/Manager/Schedule/types/scheduleTypes";
import { mapDatabaseToScheduleEvent, mapEventToDatabase } from "@/pages/Manager/Schedule/utils/eventMappers";

export function useScheduleEvents() {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['schedule-events'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userData.user?.id)
        .single();

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

      if (error) throw error;
      
      return (data as DatabaseScheduleEvent[]).map(mapDatabaseToScheduleEvent);
    },
  });

  const createEvent = useMutation({
    mutationFn: async (event: Omit<ScheduleEvent, 'id' | 'color'>) => {
      const { data: userData } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userData.user?.id)
        .single();
      
      const eventData = {
        ...mapEventToDatabase(event),
        created_by: userData.user?.id,
        company_id: userProfile?.company_id,
      };

      const { data, error } = await supabase
        .from('schedule_events')
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;

      if (event.devices?.length) {
        const { error: assignmentError } = await supabase
          .from('schedule_device_assignments')
          .insert(
            event.devices.map(device => ({
              schedule_id: data.id,
              device_id: device.device_id
            }))
          );

        if (assignmentError) throw assignmentError;
      }

      return mapDatabaseToScheduleEvent(data as DatabaseScheduleEvent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create event');
      console.error('Error creating event:', error);
    },
  });

  const updateEvent = useMutation({
    mutationFn: async (event: ScheduleEvent) => {
      const eventData = mapEventToDatabase(event);

      const { error: updateError } = await supabase
        .from('schedule_events')
        .update(eventData)
        .eq('id', event.id);

      if (updateError) throw updateError;

      if (event.devices) {
        const { error: deleteError } = await supabase
          .from('schedule_device_assignments')
          .delete()
          .eq('schedule_id', event.id);

        if (deleteError) throw deleteError;

        if (event.devices.length > 0) {
          const { error: assignmentError } = await supabase
            .from('schedule_device_assignments')
            .insert(
              event.devices.map(device => ({
                schedule_id: event.id,
                device_id: device.device_id
              }))
            );

          if (assignmentError) throw assignmentError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete event');
      console.error('Error deleting event:', error);
    },
  });

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}