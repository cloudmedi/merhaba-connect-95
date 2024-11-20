import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useState } from "react";
import { DeviceGroupDialog } from "./DeviceGroupDialog";

interface DeviceGroupManagementProps {
  selectedDevices: string[];
  onCreateGroup: (group: DeviceGroup) => void;
}

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
}

export function DeviceGroupManagement({ selectedDevices, onCreateGroup }: DeviceGroupManagementProps) {
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowGroupDialog(true)}
        disabled={selectedDevices.length === 0}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Grup Oluştur ({selectedDevices.length})
      </Button>

      <DeviceGroupDialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        selectedDevices={selectedDevices}
        onCreateGroup={onCreateGroup}
      />
    </>
  );
}