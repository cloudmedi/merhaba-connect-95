import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface DeviceGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDevices: string[];
  onCreateGroup: (group: { name: string; description: string; deviceIds: string[] }) => void;
}

export function DeviceGroupDialog({ isOpen, onClose, selectedDevices, onCreateGroup }: DeviceGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!groupName.trim()) return;

    onCreateGroup({
      name: groupName,
      description,
      deviceIds: selectedDevices
    });
    
    setGroupName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Device Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Devices ({selectedDevices.length})</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {selectedDevices.map((deviceId) => (
                <div key={deviceId} className="flex items-center space-x-2 py-2">
                  <Checkbox checked disabled />
                  <span className="text-sm">Device {deviceId}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!groupName.trim() || selectedDevices.length === 0}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}