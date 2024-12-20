import api from '@/lib/api';

export const deviceService = {
  getDevices: async () => {
    const response = await api.get('/manager/devices');
    return response.data;
  },

  createDevice: async (data: any) => {
    const response = await api.post('/manager/devices', data);
    return response.data;
  },

  updateDevice: async (id: string, data: any) => {
    const response = await api.put(`/manager/devices/${id}`, data);
    return response.data;
  },

  deleteDevice: async (id: string) => {
    const response = await api.delete(`/manager/devices/${id}`);
    return response.data;
  },

  verifyDevice: async (token: string) => {
    const response = await api.post('/manager/devices/verify', { token });
    return response.data;
  }
};