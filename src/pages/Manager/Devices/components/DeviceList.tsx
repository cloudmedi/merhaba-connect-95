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

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-2">Henüz kayıtlı cihaz bulunmuyor</p>
        <p className="text-sm text-gray-400">Yeni bir cihaz ekleyerek başlayın</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-480px)]">
      <div className="grid grid-cols-1 gap-4 p-4">
        {devices.map((device) => (
          <DeviceListItem 
            key={device.id} 
            device={device}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </ScrollArea>
  );
}