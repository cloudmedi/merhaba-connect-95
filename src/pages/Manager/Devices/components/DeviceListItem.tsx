import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOfflinePlayers } from "@/hooks/useOfflinePlayers";
import { toast } from "sonner";
import { Device } from "../hooks/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface DeviceListItemProps {
  device: Device;
}

export function DeviceListItem({ device }: DeviceListItemProps) {
  const { registerPlayer } = useOfflinePlayers();

  const handleRegisterOfflinePlayer = async () => {
    try {
      await registerPlayer.mutateAsync(device.id);
      toast.success('Cihaz başarıyla offline player olarak kaydedildi');
    } catch (error) {
      toast.error('Cihaz kaydedilirken bir hata oluştu');
    }
  };

  const formattedLastSeen = device.last_seen 
    ? formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })
    : 'Hiç bağlanmadı';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.branches?.name || 'Şube atanmamış'}</p>
          </div>
          <Badge variant={device.status === 'online' ? 'success' : 'secondary'}>
            {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
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