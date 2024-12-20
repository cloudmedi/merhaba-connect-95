import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { ScheduleEvent } from "../types/scheduleTypes";

export function useScheduleMutations() {
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (event: Omit<ScheduleEvent, 'id' | 'color'>) => {
      const { data } = await api.post('/admin/schedules', event);
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
      const { data } = await api.put(`/admin/schedules/${event.id}`, event);
      return data;
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
      await api.delete(`/admin/schedules/${id}`);
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