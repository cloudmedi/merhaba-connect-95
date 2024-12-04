import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScheduleEvent } from "../types";
import { Json } from "@/integrations/supabase/types";

type DatabaseScheduleEvent = {
  id: string;
  title: string;
  description?: string;
  playlist_id?: string;
  start_time: string;
  end_time: string;
  recurrence?: Json;
  notifications?: Json;
  created_by?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  playlists?: {
    id: string;
    name: string;
    artwork_url?: string;
  };
  devices?: Array<{
    device_id: string;
  }>;
};

const mapDatabaseToScheduleEvent = (dbEvent: DatabaseScheduleEvent): ScheduleEvent => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  playlist_id: dbEvent.playlist_id,
  start_time: dbEvent.start_time,
  end_time: dbEvent.end_time,
  recurrence: dbEvent.recurrence as ScheduleEvent['recurrence'],
  notifications: dbEvent.notifications as ScheduleEvent['notifications'],
  created_by: dbEvent.created_by,
  company_id: dbEvent.company_id,
  created_at: dbEvent.created_at,
  updated_at: dbEvent.updated_at,
  playlist: dbEvent.playlists,
  devices: dbEvent.devices,
  color: { primary: '#6E59A5', secondary: '#E5DEFF', text: '#1A1F2C' }
});

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
    mutationFn: async (event: Omit<ScheduleEvent, 'id'>) => {
      const { data: userData } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userData.user?.id)
        .single();
      
      const eventData: Omit<DatabaseScheduleEvent, 'id'> = {
        title: event.title,
        description: event.description,
        playlist_id: event.playlist_id,
        start_time: event.start_time,
        end_time: event.end_time,
        recurrence: event.recurrence as Json,
        notifications: event.notifications as Json,
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
      const eventData: Partial<DatabaseScheduleEvent> = {
        title: event.title,
        description: event.description,
        playlist_id: event.playlist_id,
        start_time: event.start_time,
        end_time: event.end_time,
        recurrence: event.recurrence as Json,
        notifications: event.notifications as Json,
      };

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