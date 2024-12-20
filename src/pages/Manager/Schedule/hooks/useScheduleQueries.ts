import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ScheduleEvent } from "../types/scheduleTypes";

export function useScheduleQueries() {
  return useQuery({
    queryKey: ['schedule-events'],
    queryFn: async () => {
      const { data } = await api.get('/admin/schedules');
      return data.map((item: any): ScheduleEvent => ({
        id: item.id,
        title: item.title,
        description: item.description,
        playlist_id: item.playlistId,
        start_time: item.startTime,
        end_time: item.endTime,
        color: {
          primary: '#6E59A5',
          secondary: '#8A7CB8',
          text: '#FFFFFF'
        },
        recurrence: item.recurrence,
        notifications: item.notifications,
        created_by: item.createdBy,
        company_id: item.companyId,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        playlist: item.playlist,
        devices: item.devices
      }));
    }
  });
}