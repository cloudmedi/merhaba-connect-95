import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScheduleEvent } from "../types/scheduleTypes";
import { mapEventToDatabase } from "../utils/eventMappers";

export function useScheduleMutations() {
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (event: Omit<ScheduleEvent, 'id' | 'color'>) => {
      console.log('📝 Creating event with data:', event);
      
      const { data: userData } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userData.user?.id)
        .single();
      
      const eventData = mapEventToDatabase({
        ...event,
        created_by: userData.user?.id,
        company_id: userProfile?.company_id,
      });

      console.log('💾 Mapped event data for database:', eventData);

      const { data, error } = await supabase
        .from('schedule_events')
        .insert({
          ...eventData,
          title: event.title,
          start_time: event.start_time,
          end_time: event.end_time,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating event:', error);
        throw error;
      }

      console.log('✅ Created event in database:', data);

      if (event.devices?.length) {
        const deviceAssignments = event.devices.map(device => ({
          schedule_id: data.id,
          device_id: device.device_id
        }));

        console.log('🔗 Creating device assignments:', deviceAssignments);

        const { error: assignmentError } = await supabase
          .from('schedule_device_assignments')
          .insert(deviceAssignments);

        if (assignmentError) {
          console.error('❌ Error creating device assignments:', assignmentError);
          throw assignmentError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create event');
      console.error('❌ Error creating event:', error);
    },
  });

  const updateEvent = useMutation({
    mutationFn: async (event: ScheduleEvent) => {
      const eventData = mapEventToDatabase(event);

      const { error: updateError } = await supabase
        .from('schedule_events')
        .update({
          ...eventData,
          title: event.title,
          start_time: event.start_time,
          end_time: event.end_time,
        })
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
          const { error: assignmentError } = await supabase
            .from('schedule_device_assignments')
            .insert(
              event.devices.map(device => ({
                schedule_id: event.id,
                device_id: device.device_id
              }))
            );

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
    createEvent,
    updateEvent,
    deleteEvent,
  };
}