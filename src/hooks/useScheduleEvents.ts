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

      console.log('Fetching events for company:', userProfile?.company_id);

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
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Raw events from database:', data);
      const mappedEvents = (data as DatabaseScheduleEvent[]).map(mapDatabaseToScheduleEvent);
      console.log('Mapped events:', mappedEvents);
      return mappedEvents;
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

      console.log('Creating event with data:', eventData);

      const { data, error } = await supabase
        .from('schedule_events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      if (event.devices?.length) {
        const deviceAssignments = event.devices.map(device => ({
          schedule_id: data.id,
          device_id: device.device_id
        }));

        console.log('Creating device assignments:', deviceAssignments);

        const { error: assignmentError } = await supabase
          .from('schedule_device_assignments')
          .insert(deviceAssignments);

        if (assignmentError) {
          console.error('Error creating device assignments:', assignmentError);
          throw assignmentError;
        }
      }

      const createdEvent = mapDatabaseToScheduleEvent(data as DatabaseScheduleEvent);
      console.log('Created event:', createdEvent);
      return createdEvent;
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
      console.log('Updating event:', event);
      const eventData = mapEventToDatabase(event);

      const { error: updateError } = await supabase
        .from('schedule_events')
        .update(eventData)
        .eq('id', event.id);

      if (updateError) {
        console.error('Error updating event:', updateError);
        throw updateError;
      }

      if (event.devices) {
        const { error: deleteError } = await supabase
          .from('schedule_device_assignments')
          .delete()
          .eq('schedule_id', event.id);

        if (deleteError) {
          console.error('Error deleting device assignments:', deleteError);
          throw deleteError;
        }

        if (event.devices.length > 0) {
          const deviceAssignments = event.devices.map(device => ({
            schedule_id: event.id,
            device_id: device.device_id
          }));

          console.log('Updating device assignments:', deviceAssignments);

          const { error: assignmentError } = await supabase
            .from('schedule_device_assignments')
            .insert(deviceAssignments);

          if (assignmentError) {
            console.error('Error updating device assignments:', assignmentError);
            throw assignmentError;
          }
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
      console.log('Deleting event:', id);
      const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
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