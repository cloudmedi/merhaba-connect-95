import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceTab } from "./maintenance/MaintenanceTab";
import { formatDeviceStatus, formatSystemInfo } from "@/utils/deviceUtils";
import type { Device } from "../hooks/types";
import { Badge } from "@/components/ui/badge";

export function DeviceListItem({ device }: { device: Device }) {
  const [isOpen, setIsOpen] = useState(false);
  const status = formatDeviceStatus(device.status);
  const systemInfo = formatSystemInfo(device.system_info);

  return (
    <div className="space-y-2">
      <div
        className="p-4 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{device.name}</h3>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <p className="text-sm text-gray-500">Token: {device.token}</p>
        <p className="text-sm text-gray-500">Location: {device.location || 'Not specified'}</p>
        <p className="text-sm text-gray-500">Last Seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</p>
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
            
            <TabsContent value="info" className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Basic Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Category:</span> {device.category}</p>
                    <p className="text-sm"><span className="font-medium">Location:</span> {device.location || 'Not specified'}</p>
                    <p className="text-sm"><span className="font-medium">Status:</span> <span className={status.color}>{status.label}</span></p>
                    <p className="text-sm"><span className="font-medium">Token:</span> {device.token}</p>
                    <p className="text-sm"><span className="font-medium">IP Address:</span> {device.ip_address || 'Not connected'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">System Information</h4>
                  <div className="space-y-1">
                    {systemInfo.map((info, index) => (
                      <p key={index} className="text-sm">
                        <span className="font-medium">{info.label}:</span> {info.value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Schedule</h4>
                <div className="space-y-1">
                  {Object.entries(device.schedule || {}).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </p>
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