import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScheduleEvent } from "../types";

export const useScheduleEvents = () => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['schedule-events'],
    queryFn: async () => {
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
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as ScheduleEvent[];
    },
  });

  const createEvent = useMutation({
    mutationFn: async (event: Omit<ScheduleEvent, 'id'>) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('schedule_events')
        .insert({
          ...event,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (event.branches?.length) {
        const { error: assignmentError } = await supabase
          .from('schedule_device_assignments')
          .insert(
            event.branches.map(deviceId => ({
              schedule_id: data.id,
              device_id: deviceId
            }))
          );

        if (assignmentError) throw assignmentError;
      }

      return data;
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
      const { error: updateError } = await supabase
        .from('schedule_events')
        .update({
          title: event.title,
          description: event.description,
          playlist_id: event.playlist_id,
          start_time: event.start_time,
          end_time: event.end_time,
          category: event.category,
          color: event.color,
          recurrence: event.recurrence,
          notifications: event.notifications,
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      if (event.branches) {
        const { error: deleteError } = await supabase
          .from('schedule_device_assignments')
          .delete()
          .eq('schedule_id', event.id);

        if (deleteError) throw deleteError;

        if (event.branches.length > 0) {
          const { error: assignmentError } = await supabase
            .from('schedule_device_assignments')
            .insert(
              event.branches.map(deviceId => ({
                schedule_id: event.id,
                device_id: deviceId
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
};