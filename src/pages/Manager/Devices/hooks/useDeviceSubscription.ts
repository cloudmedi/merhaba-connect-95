import { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Device } from "./types";

export const useDeviceSubscription = (queryClient: QueryClient) => {
  useEffect(() => {
    const channel = supabase
      .channel('devices_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload: RealtimePostgresChangesPayload<Device>) => {
          queryClient.invalidateQueries({ queryKey: ['devices'] });
          
          const event = payload.eventType;
          const deviceName = (payload.new as Device)?.name || (payload.old as Device)?.name;
          
          if (event === 'UPDATE') {
            const oldStatus = (payload.old as Device)?.status;
            const newStatus = (payload.new as Device)?.status;
            
            if (oldStatus !== newStatus) {
              if (newStatus === 'online') {
                toast.success(`${deviceName} çevrimiçi oldu`);
              } else if (newStatus === 'offline') {
                toast.warning(`${deviceName} çevrimdışı oldu`);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};