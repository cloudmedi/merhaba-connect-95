import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDevices } from "../hooks/useDevices";
import { toast } from "sonner";

interface DeviceListProps {
  devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
  const { deleteDevice, updateDevice } = useDevices();

  const handleDelete = async (id: string) => {
    try {
      await deleteDevice.mutateAsync(id);
      toast.success('Cihaz başarıyla silindi');
    } catch (error) {
      toast.error('Cihaz silinirken bir hata oluştu');
    }
  };

  const handleEdit = async (device: Device) => {
    try {
      // For now just show a toast, implement edit dialog later
      toast.info('Düzenleme özelliği yakında eklenecek');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {devices.map((device) => (
        <DeviceListItem 
          key={device.id} 
          device={device}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}