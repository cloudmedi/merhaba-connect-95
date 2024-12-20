import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Device } from "./types";
import api from "@/lib/api";

export const useDeviceMutations = () => {
  const queryClient = useQueryClient();

  const createDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id'>) => {
      const response = await api.post('/admin/devices', device);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Cihaz başarıyla eklendi');
    },
    onError: (error: Error) => {
      toast.error('Cihaz eklenirken bir hata oluştu: ' + error.message);
    },
  });

  const updateDevice = useMutation({
    mutationFn: async ({ id, ...device }: Partial<Device> & { id: string }) => {
      const response = await api.put(`/admin/devices/${id}`, device);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Cihaz başarıyla güncellendi');
    },
    onError: (error: Error) => {
      toast.error('Cihaz güncellenirken bir hata oluştu: ' + error.message);
    },
  });

  const deleteDevice = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/devices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Cihaz başarıyla silindi');
    },
    onError: (error: Error) => {
      toast.error('Cihaz silinirken bir hata oluştu: ' + error.message);
    },
  });

  return {
    createDevice,
    updateDevice,
    deleteDevice,
  };
};