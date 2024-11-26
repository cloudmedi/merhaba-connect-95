import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOfflinePlayers } from "@/hooks/useOfflinePlayers";
import { toast } from "sonner";
import { Device } from "../hooks/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Edit, Trash2, Eye, Monitor, Signal, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DeviceListItemProps {
  device: Device;
  onDelete: (id: string) => void;
  onEdit: (device: Device) => void;
}

export function DeviceListItem({ device, onDelete, onEdit }: DeviceListItemProps) {
  const { registerPlayer } = useOfflinePlayers();
  const [showPreview, setShowPreview] = useState(false);

  const handleRegisterOfflinePlayer = async () => {
    try {
      await registerPlayer.mutateAsync(device.id);
      toast.success('Cihaz başarıyla offline player olarak kaydedildi');
    } catch (error) {
      toast.error('Cihaz kaydedilirken bir hata oluştu');
    }
  };

  const lastSeen = device.last_seen 
    ? formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })
    : 'Hiç bağlanmadı';

  const getStatusIcon = () => {
    if (device.status === 'online') return <Signal className="h-4 w-4 text-emerald-500" />;
    if (device.system_info?.health === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <Monitor className="h-4 w-4 text-gray-400" />;
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.branches?.name || 'Şube atanmamış'}</p>
          </div>
        </div>
        <Badge variant={device.status === 'online' ? 'success' : 'secondary'}>
          {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Son görülme:</span>
          <span>{lastSeen}</span>
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

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Önizle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cihaz Detayları - {device.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Sistem Bilgileri</h4>
                    {device.system_info?.cpu && (
                      <div className="space-y-1">
                        <p className="text-sm"><span className="font-medium">CPU:</span> {device.system_info.cpu.brand}</p>
                        <p className="text-sm"><span className="font-medium">Çekirdek:</span> {device.system_info.cpu.cores}</p>
                        <p className="text-sm"><span className="font-medium">Hız:</span> {device.system_info.cpu.speed} GHz</p>
                      </div>
                    )}
                  </div>
                  {device.system_info?.memory && (
                    <div>
                      <h4 className="font-medium mb-2">Bellek</h4>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Toplam:</span> {Math.round(device.system_info.memory.total / (1024 * 1024 * 1024))} GB
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Kullanılan:</span> {Math.round(device.system_info.memory.used / (1024 * 1024 * 1024))} GB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {device.system_info?.os && (
                    <div>
                      <h4 className="font-medium mb-2">İşletim Sistemi</h4>
                      <div className="space-y-1">
                        <p className="text-sm"><span className="font-medium">Platform:</span> {device.system_info.os.platform}</p>
                        <p className="text-sm"><span className="font-medium">Sürüm:</span> {device.system_info.os.release}</p>
                        <p className="text-sm"><span className="font-medium">Mimari:</span> {device.system_info.os.arch}</p>
                      </div>
                    </div>
                  )}
                  {device.system_info?.network && (
                    <div>
                      <h4 className="font-medium mb-2">Ağ</h4>
                      {device.system_info.network.map((net, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-sm"><span className="font-medium">Arayüz:</span> {net.iface}</p>
                          <p className="text-sm"><span className="font-medium">IP:</span> {net.ip4}</p>
                          <p className="text-sm"><span className="font-medium">MAC:</span> {net.mac}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={() => onEdit(device)}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>

          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(device.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>

        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleRegisterOfflinePlayer}
        >
          Offline Player Olarak Kaydet
        </Button>
      </div>
    </Card>
  );
}