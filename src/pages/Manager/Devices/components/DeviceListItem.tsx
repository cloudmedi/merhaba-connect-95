import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Device } from "../hooks/types";
import { Monitor, Signal, AlertTriangle, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EditDeviceDialog } from "./EditDeviceDialog";

interface DeviceListItemProps {
  device: Device;
  onDelete: (id: string) => void;
  onEdit: (device: Device) => void;
}

export function DeviceListItem({ device, onDelete, onEdit }: DeviceListItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const lastSeen = device.last_seen 
    ? formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })
    : 'Hiç bağlanmadı';

  const getStatusIcon = () => {
    if (device.status === 'online') return <Signal className="h-4 w-4 text-emerald-500" />;
    if (device.system_info?.health === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <Monitor className="h-4 w-4 text-gray-400" />;
  };

  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell className="w-[40px]">
        {getStatusIcon()}
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <p className="font-medium text-gray-900">{device.name}</p>
          <p className="text-sm text-gray-500">{device.branches?.name || 'Şube atanmamış'}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={device.status === 'online' ? 'success' : 'secondary'}>
          {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-500">
        {lastSeen}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Detaylar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => {
                if (confirm('Bu cihazı silmek istediğinizden emin misiniz?')) {
                  onDelete(device.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
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

        <EditDeviceDialog
          device={device}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={onEdit}
        />
      </TableCell>
    </TableRow>
  );
}