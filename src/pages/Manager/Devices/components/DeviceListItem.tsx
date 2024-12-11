import { TableRow } from "@/components/ui/table";
import { Device } from "../hooks/types";
import { useState } from "react";
import { DeviceInfo } from "./DeviceInfo";
import { DeviceActions } from "./DeviceActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditDeviceDialog } from "./EditDeviceDialog";
import { PowerScheduleDialog } from "./PowerScheduleDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeviceListItemProps {
  device: Device;
  onDelete: (id: string) => void;
}

export function DeviceListItem({ device, onDelete }: DeviceListItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const handleSave = async (updatedDevice: Partial<Device>) => {
    try {
      const { error } = await supabase
        .from('devices')
        .update(updatedDevice)
        .eq('id', device.id);

      if (error) throw error;
      toast.success('Cihaz başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Cihaz güncellenirken bir hata oluştu');
    }
  };

  return (
    <TableRow className="hover:bg-gray-50/50">
      <DeviceInfo device={device} />
      <DeviceActions 
        device={device}
        onDelete={onDelete}
        onShowDetails={() => setShowDetails(true)}
        onShowEditDialog={() => setShowEditDialog(true)}
        onShowScheduleDialog={() => setShowScheduleDialog(true)}
      />

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
        onSave={handleSave}
      />

      <PowerScheduleDialog
        device={device}
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSave={handleSave}
      />
    </TableRow>
  );
}
