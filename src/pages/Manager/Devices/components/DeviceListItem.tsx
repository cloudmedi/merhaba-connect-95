import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceTab } from "./maintenance/MaintenanceTab";
import { Button } from "@/components/ui/button";
import { useOfflinePlayers } from "@/hooks/useOfflinePlayers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Device } from "../hooks/types";
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, Memory, HardDrive } from "lucide-react";

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

export function DeviceListItem({ device }: { device: Device }) {
  const [isOpen, setIsOpen] = useState(false);
  const [systemInfo, setSystemInfo] = useState(device.system_info);
  const { registerPlayer } = useOfflinePlayers();

  useEffect(() => {
    const channel = supabase.channel(`device-${device.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'devices',
          filter: `id=eq.${device.id}`
        },
        (payload) => {
          const updatedDevice = payload.new as Device;
          setSystemInfo(updatedDevice.system_info);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [device.id]);

  const handleRegisterOfflinePlayer = async () => {
    try {
      await registerPlayer.mutateAsync(device.id);
      toast.success('Device registered as offline player');
    } catch (error) {
      toast.error('Failed to register device as offline player');
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="p-4 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{device.name}</h3>
          <Badge 
            variant={device.status === 'online' ? 'success' : 'destructive'}
            className="capitalize"
          >
            {device.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {systemInfo?.cpu?.cores || '?'} Cores
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Memory className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {systemInfo?.memory?.total ? formatBytes(systemInfo.memory.total) : '?'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {device.ip_address || 'Unknown IP'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {systemInfo?.os?.platform || 'Unknown OS'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRegisterOfflinePlayer();
            }}
          >
            Register as Offline Player
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Device Details: {device.name}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="flex-1">
            <TabsList>
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="p-4 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">System Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">CPU</h5>
                      <p className="text-sm text-gray-600">Manufacturer: {systemInfo?.cpu?.manufacturer || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">Model: {systemInfo?.cpu?.brand || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">Cores: {systemInfo?.cpu?.cores || '?'}</p>
                      <p className="text-sm text-gray-600">Speed: {systemInfo?.cpu?.speed || '?'} GHz</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Memory</h5>
                      <p className="text-sm text-gray-600">Total: {systemInfo?.memory?.total ? formatBytes(systemInfo.memory.total) : '?'}</p>
                      <p className="text-sm text-gray-600">Used: {systemInfo?.memory?.used ? formatBytes(systemInfo.memory.used) : '?'}</p>
                      <p className="text-sm text-gray-600">Free: {systemInfo?.memory?.free ? formatBytes(systemInfo.memory.free) : '?'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Operating System</h5>
                  <p className="text-sm text-gray-600">Platform: {systemInfo?.os?.platform || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">Distribution: {systemInfo?.os?.distro || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">Release: {systemInfo?.os?.release || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">Architecture: {systemInfo?.os?.arch || 'Unknown'}</p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Network Interfaces</h5>
                  {systemInfo?.network?.map((net: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p className="text-sm text-gray-600">Interface: {net.iface}</p>
                      <p className="text-sm text-gray-600">IP: {net.ip4}</p>
                      <p className="text-sm text-gray-600">MAC: {net.mac}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance">
              <MaintenanceTab />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}