import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";
import { toast } from "sonner";
import { useDevices } from "../hooks/useDevices";
import { useDeviceMutations } from "../hooks/useDeviceMutations";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface DeviceListProps {
  devices: Device[];
}

const ITEMS_PER_PAGE = 10;

export function DeviceList({ devices }: DeviceListProps) {
  const { deleteDevice } = useDeviceMutations();
  const [displayedDevices, setDisplayedDevices] = useState<Device[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setDisplayedDevices(devices.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(devices.length > ITEMS_PER_PAGE);
  }, [devices]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page, devices]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextItems = devices.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE
      );
      
      if (nextItems.length > 0) {
        setDisplayedDevices(prev => [...prev, ...nextItems]);
        setPage(prev => prev + 1);
        setHasMore(devices.length > (page + 1) * ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more devices:', error);
      toast.error('Cihazlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'DEVICE_STATUS_CHANGED') {
        const { deviceId, status, deviceName } = data;
        
        if (status === 'online') {
          toast.success(`${deviceName} çevrimiçi oldu`);
        } else if (status === 'offline') {
          toast.error(`${deviceName} çevrimdışı oldu`);
        }
      }
    };

    return () => {
      socket.close();
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

  if (displayedDevices.length === 0) {
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
          {displayedDevices.map((device) => (
            <DeviceListItem 
              key={device.id} 
              device={device}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
      
      {/* Sentinel element for infinite scroll */}
      <div 
        id="sentinel" 
        className="h-4 w-full flex items-center justify-center p-4"
      >
        {loading && (
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        )}
      </div>
    </Card>
  );
}