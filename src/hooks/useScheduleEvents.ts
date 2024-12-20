import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/api/scheduleService";
import { toast } from "sonner";
import { ScheduleEvent } from "@/pages/Manager/Schedule/types/scheduleTypes";

export function useScheduleEvents() {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['schedule-events'],
    queryFn: scheduleService.getAllSchedules
  });

  const createEvent = useMutation({
    mutationFn: scheduleService.createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create event');
      console.error('Error creating event:', error);
    },
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, ...data }: ScheduleEvent) => 
      scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
    },
  });

  const deleteEvent = useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: Error) => {
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