import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useState } from "react";
import { DeviceGroupDialog } from "./DeviceGroupDialog";

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
}

export function DeviceGroupManagement({ onCreateGroup }: { onCreateGroup: (group: DeviceGroup) => void }) {
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowGroupDialog(true)}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Grup Oluştur
      </Button>

      <DeviceGroupDialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        onCreateGroup={onCreateGroup}
      />
    </>
  );
}