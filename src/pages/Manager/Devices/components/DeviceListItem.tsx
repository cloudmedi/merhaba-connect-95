import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOfflinePlayers } from "@/hooks/useOfflinePlayers";
import { toast } from "sonner";
import { Device } from "../hooks/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DeviceListItemProps {
  device: Device;
}

export function DeviceListItem({ device }: DeviceListItemProps) {
  const { registerPlayer } = useOfflinePlayers();
  const [status, setStatus] = useState(device.status);
  const [lastSeen, setLastSeen] = useState(device.last_seen);

  useEffect(() => {
    // Subscribe to device status changes
    const channel = supabase
      .channel(`device-${device.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `id=eq.${device.id}`
        },
        (payload: any) => {
          if (payload.new) {
            setStatus(payload.new.status);
            setLastSeen(payload.new.last_seen);
          }
        }
      )
      .subscribe();

    // Check if device is actually offline
    const checkOfflineStatus = setInterval(() => {
      const lastSeenDate = new Date(lastSeen || '');
      const now = new Date();
      const diffInSeconds = (now.getTime() - lastSeenDate.getTime()) / 1000;
      
      // If no heartbeat received in 60 seconds, consider device offline
      if (diffInSeconds > 60 && status === 'online') {
        setStatus('offline');
      }
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(checkOfflineStatus);
    };
  }, [device.id, lastSeen, status]);

  const handleRegisterOfflinePlayer = async () => {
    try {
      await registerPlayer.mutateAsync(device.id);
      toast.success('Cihaz başarıyla offline player olarak kaydedildi');
    } catch (error) {
      toast.error('Cihaz kaydedilirken bir hata oluştu');
    }
  };

  const formattedLastSeen = lastSeen 
    ? formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: tr })
    : 'Hiç bağlanmadı';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.branches?.name || 'Şube atanmamış'}</p>
          </div>
          <Badge variant={status === 'online' ? 'success' : 'secondary'}>
            {status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Son görülme:</span>
            <span>{formattedLastSeen}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">IP Adresi:</span>
            <span>{device.ip_address || 'Bilinmiyor'}</span>
          </div>

          {device.system_info && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Sistem:</span>
              <span>{device.system_info.os?.platform || 'Bilinmiyor'}</span>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleRegisterOfflinePlayer}
        >
          Offline Player Olarak Kaydet
        </Button>
      </div>
    </Card>
  );
}