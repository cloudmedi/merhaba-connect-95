import axios from '@/lib/axios';
import type { ScheduleEvent } from '@/pages/Manager/Schedule/types/scheduleTypes';

export const scheduleService = {
  getAllSchedules: async () => {
    const response = await axios.get('/manager/schedules');
    return response.data;
  },

  createSchedule: async (data: Omit<ScheduleEvent, 'id'>) => {
    const response = await axios.post('/manager/schedules', data);
    return response.data;
  },

  updateSchedule: async (id: string, data: Partial<ScheduleEvent>) => {
    const response = await axios.put(`/manager/schedules/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id: string) => {
    await axios.delete(`/manager/schedules/${id}`);
  }
};