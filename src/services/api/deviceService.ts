import axios from '@/lib/axios';
import type { Device } from '@/pages/Manager/Devices/hooks/types';

export const deviceService = {
  getAllDevices: async () => {
    const response = await axios.get('/manager/devices');
    return response.data;
  },

  createDevice: async (data: Omit<Device, 'id'>) => {
    const response = await axios.post('/manager/devices', data);
    return response.data;
  },

  updateDevice: async (id: string, data: Partial<Device>) => {
    const response = await axios.put(`/manager/devices/${id}`, data);
    return response.data;
  },

  deleteDevice: async (id: string) => {
    await axios.delete(`/manager/devices/${id}`);
  },

  verifyToken: async (token: string) => {
    const response = await axios.post('/manager/devices/verify-token', { token });
    return response.data;
  }
};