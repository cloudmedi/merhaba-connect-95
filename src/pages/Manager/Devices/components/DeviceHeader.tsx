import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { NewDeviceDialog } from "./NewDeviceDialog";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { useDevices } from "../hooks/useDevices";

export function DeviceHeader() {
  const [showNewDeviceDialog, setShowNewDeviceDialog] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const { devices } = useDevices();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cihazlar</h2>
        <p className="text-sm text-gray-500">Bağlı cihazlarınızı yönetin</p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowCreateGroupDialog(true)} 
          variant="outline"
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Grup Ekle
        </Button>
        <Button 
          onClick={() => setShowNewDeviceDialog(true)} 
          className="bg-[#6E59A5] hover:bg-[#5A478A] gap-2"
        >
          <Plus className="h-4 w-4" />
          Cihaz Ekle
        </Button>
      </div>
      <NewDeviceDialog 
        open={showNewDeviceDialog} 
        onOpenChange={setShowNewDeviceDialog} 
      />
      <CreateGroupDialog
        open={showCreateGroupDialog}
        onOpenChange={setShowCreateGroupDialog}
        devices={devices}
      />
    </div>
  );
}