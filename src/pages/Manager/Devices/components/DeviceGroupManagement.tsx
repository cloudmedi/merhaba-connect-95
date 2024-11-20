import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { DeviceGroupDialog } from "./DeviceGroupDialog";
import { useState } from "react";

interface DeviceGroupManagementProps {
  selectedDevices: string[];
  onCreateGroup: (group: { name: string; description: string; deviceIds: string[] }) => void;
}

export function DeviceGroupManagement({ selectedDevices, onCreateGroup }: DeviceGroupManagementProps) {
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsGroupDialogOpen(true)}
        disabled={selectedDevices.length === 0}
        className="flex items-center gap-2"
      >
        <Users className="w-4 h-4" />
        Create Group ({selectedDevices.length})
      </Button>

      <DeviceGroupDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
        selectedDevices={selectedDevices}
        onCreateGroup={onCreateGroup}
      />
    </>
  );
}