import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";
import { toast } from "sonner";
import { useDevices } from "../hooks/useDevices";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DeviceListProps {
  devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
  const { deleteDevice } = useDevices();

  useEffect(() => {
    const channel = supabase.channel('device_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload) => {
          console.log('Device status changed:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
            const oldStatus = payload.old.status;
            const newStatus = payload.new.status;
            const deviceName = payload.new.name;
            
            if (oldStatus !== newStatus) {
              if (newStatus === 'online') {
                toast.success(`${deviceName} çevrimiçi oldu`);
              } else if (newStatus === 'offline') {
                toast.error(`${deviceName} çevrimdışı oldu`);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDevice.mutateAsync(id);
      toast.success('Cihaz başarıyla silindi');
    } catch (error) {
      toast.error('Cihaz silinirken bir hata oluştu');
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
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}