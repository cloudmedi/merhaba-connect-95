import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddDeviceDialog } from "./AddDeviceDialog";
import { useState } from "react";

export function DeviceHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Devices</h2>
        <p className="text-muted-foreground">
          Manage and monitor your connected devices
        </p>
      </div>
      <Button onClick={() => setShowAddDialog(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Device
      </Button>
      <AddDeviceDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}