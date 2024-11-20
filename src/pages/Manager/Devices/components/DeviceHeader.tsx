import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { AddDeviceDialog } from "./AddDeviceDialog";
import { DeviceGroupDialog } from "./DeviceGroupDialog";
import { useState } from "react";

export function DeviceHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Devices</h2>
        <p className="text-muted-foreground">
          Manage and monitor your connected devices
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setShowGroupDialog(true)}>
          <Users className="mr-2 h-4 w-4" />
          Create Group
        </Button>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Device
        </Button>
      </div>
      <AddDeviceDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <DeviceGroupDialog open={showGroupDialog} onOpenChange={setShowGroupDialog} onCreateGroup={() => {}} />
    </div>
  );
}