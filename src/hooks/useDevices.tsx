import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deviceService } from "@/services/api/deviceService";
import { toast } from "sonner";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

export const useDevices = () => {
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: deviceService.getAllDevices
  });

  const createDevice = useMutation({
    mutationFn: deviceService.createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add device: ' + error.message);
    },
  });

  const updateDevice = useMutation({
    mutationFn: ({ id, ...data }: Partial<Device> & { id: string }) => 
      deviceService.updateDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update device: ' + error.message);
    },
  });

  const deleteDevice = useMutation({
    mutationFn: deviceService.deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete device: ' + error.message);
    },
  });

  return {
    devices,
    isLoading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
  };
};