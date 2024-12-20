import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GroupForm } from "./group-dialog/GroupForm";
import { DeviceSelection } from "./group-dialog/DeviceSelection";
import { useGroupCreation } from "./group-dialog/useGroupCreation";
import type { Device } from "../hooks/types";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  devices: Device[];
}

export function CreateGroupDialog({ open, onOpenChange, onSuccess, devices }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading, createGroup } = useGroupCreation();

  const handleCreateGroup = async () => {
    const success = await createGroup(groupName, description, selectedDevices);
    if (success) {
      onSuccess?.();
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setSelectedDevices([]);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Grup Oluştur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <GroupForm
            groupName={groupName}
            description={description}
            setGroupName={setGroupName}
            setDescription={setDescription}
          />

          <DeviceSelection
            devices={devices}
            selectedDevices={selectedDevices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedDevices={setSelectedDevices}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                İptal
              </Button>
              <Button onClick={handleCreateGroup} disabled={isLoading}>
                {isLoading ? "Oluşturuluyor..." : "Grup Oluştur"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}