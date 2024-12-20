import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Device } from "./types";
import api from "@/lib/api";

export const useDevices = () => {
  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await api.get('/admin/devices');
      return response.data;
    }
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'DEVICE_STATUS_CHANGED') {
        const { deviceId, status, deviceName } = data;
        
        if (status === 'online') {
          toast.success(`${deviceName} çevrimiçi oldu`);
        } else if (status === 'offline') {
          toast.error(`${deviceName} çevrimdışı oldu`);
        }
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    devices,
    isLoading,
    error
  };
};