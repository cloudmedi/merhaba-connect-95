import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceTab } from "./maintenance/MaintenanceTab";
import type { Device } from "../hooks/types";

export function DeviceListItem({ device }: { device: Device }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div
        className="p-4 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <h3 className="text-lg font-semibold">{device.name}</h3>
        <p className="text-sm text-gray-500">{device.ip_address}</p>
        <p className="text-sm text-gray-500">Status: {device.status}</p>
        <p className="text-sm text-gray-500">Last Seen: {device.last_seen}</p>
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
              <div className="p-4">
                <h4 className="text-lg font-semibold">Device Information</h4>
                <p className="text-sm text-gray-500">Category: {device.category}</p>
                <p className="text-sm text-gray-500">Location: {device.location}</p>
                <p className="text-sm text-gray-500">Status: {device.status}</p>
                <p className="text-sm text-gray-500">Created At: {device.created_at}</p>
                <p className="text-sm text-gray-500">Updated At: {device.updated_at}</p>
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
