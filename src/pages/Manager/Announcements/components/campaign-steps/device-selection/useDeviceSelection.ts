import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useDeviceSelection() {
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data } = await api.get('/manager/devices');
      return data;
    }
  });

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['device-groups'],
    queryFn: async () => {
      const { data } = await api.get('/manager/device-groups');
      return data;
    }
  });

  return {
    devices,
    groups,
    isLoadingDevices,
    isLoadingGroups
  };
}