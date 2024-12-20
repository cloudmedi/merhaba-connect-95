import { useScheduleQueries } from "@/pages/Manager/Schedule/hooks/useScheduleQueries";
import { useScheduleMutations } from "@/pages/Manager/Schedule/hooks/useScheduleMutations";

export function useScheduleEvents() {
  const { data: events = [], isLoading, error } = useScheduleQueries();
  const { createEvent, updateEvent, deleteEvent } = useScheduleMutations();

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}