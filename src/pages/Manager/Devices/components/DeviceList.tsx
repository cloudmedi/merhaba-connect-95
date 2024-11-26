import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";
import { toast } from "sonner";
import { useDevices } from "../hooks/useDevices";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";

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
    <Card className="border-none">
      <ScrollArea className="h-[calc(100vh-400px)]">
        <Table>
          <TableBody>
            {devices.map((device) => (
              <DeviceListItem 
                key={device.id} 
                device={device}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}