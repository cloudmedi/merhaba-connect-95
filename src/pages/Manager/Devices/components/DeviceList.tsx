import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";
import { toast } from "sonner";
import { useDevices } from "../hooks/useDevices";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Device Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
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
    </Card>
  );
}