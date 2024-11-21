import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Users, Plus } from "lucide-react";

interface DeviceGroup {
  id: string;
  name: string;
  deviceIds: string[];
  description?: string;
}

interface DeviceGroupingProps {
  selectedDevices: string[];
  onCreateGroup: (group: DeviceGroup) => void;
}

export function DeviceGrouping({ selectedDevices, onCreateGroup }: DeviceGroupingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleCreateGroup = () => {
    if (!groupName) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (selectedDevices.length === 0) {
      toast({
        title: "Error",
        description: "Please select devices to create a group",
        variant: "destructive",
      });
      return;
    }

    const newGroup: DeviceGroup = {
      id: crypto.randomUUID(),
      name: groupName,
      description,
      deviceIds: selectedDevices,
    };

    onCreateGroup(newGroup);
    toast({
      title: "Success",
      description: "Device group created successfully",
    });
    setIsOpen(false);
    setGroupName("");
    setDescription("");
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        disabled={selectedDevices.length === 0}
        className="flex items-center gap-2"
      >
        <Users className="w-4 h-4" />
        Create Group ({selectedDevices.length})
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Device Group</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Devices ({selectedDevices.length})</label>
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}