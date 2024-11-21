import { useDeviceQueries } from "./useDeviceQueries";
import { useDeviceMutations } from "./useDeviceMutations";
import { useDeviceSubscription } from "./useDeviceSubscription";
import { useQueryClient } from "@tanstack/react-query";

export const useDevices = () => {
  const queryClient = useQueryClient();
  const { data: devices = [], isLoading, error } = useDeviceQueries();
  const { createDevice, updateDevice, deleteDevice } = useDeviceMutations();

  useDeviceSubscription(queryClient);

  return {
    devices,
    isLoading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
  };
};

export type { Device } from "./types";