import { useDeviceQueries } from "./useDeviceQueries";
import { useDeviceMutations } from "./useDeviceMutations";
import { useDeviceSubscription } from "./useDeviceSubscription";

export const useDevices = () => {
  const { data: devices = [], isLoading, error } = useDeviceQueries();
  const { createDevice, updateDevice, deleteDevice } = useDeviceMutations();

  useDeviceSubscription();

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