import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NewDeviceDialog } from "./NewDeviceDialog";

export function DeviceHeader() {
  const [showNewDeviceDialog, setShowNewDeviceDialog] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Devices</h2>
        <p className="text-sm text-gray-500">Manage your connected devices</p>
      </div>
      <Button onClick={() => setShowNewDeviceDialog(true)} className="bg-[#6E59A5] hover:bg-[#5A478A]">
        <Plus className="mr-2 h-4 w-4" />
        Add Device
      </Button>
      <NewDeviceDialog 
        open={showNewDeviceDialog} 
        onOpenChange={setShowNewDeviceDialog} 
      />
    </div>
  );
}