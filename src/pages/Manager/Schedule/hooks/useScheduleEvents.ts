import { useScheduleQueries } from "./useScheduleQueries";
import { useScheduleMutations } from "./useScheduleMutations";

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