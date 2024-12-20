import api from '@/lib/api';

export const scheduleService = {
  getSchedules: async () => {
    const response = await api.get('/manager/schedules');
    return response.data;
  },

  createSchedule: async (data: any) => {
    const response = await api.post('/manager/schedules', data);
    return response.data;
  },

  updateSchedule: async (id: string, data: any) => {
    const response = await api.put(`/manager/schedules/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id: string) => {
    const response = await api.delete(`/manager/schedules/${id}`);
    return response.data;
  }
};