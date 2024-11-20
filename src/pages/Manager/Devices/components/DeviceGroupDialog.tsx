import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { DeviceGroup } from "./DeviceGroupManagement";

interface DeviceGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (group: DeviceGroup) => void;
}

interface Device {
  id: string;
  branchName: string;
  location: string;
}

// Mock data - replace with your actual device data
const mockDevices: Device[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  branchName: `Branch ${i + 1}`,
  location: `Location ${i + 1}`,
}));

export function DeviceGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
}: DeviceGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const handleCreateGroup = () => {
    if (!groupName) {
      toast.error("Lütfen grup adı girin");
      return;
    }

    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    const newGroup: DeviceGroup = {
      id: crypto.randomUUID(),
      name: groupName,
      description,
      deviceIds: selectedDevices,
    };

    onCreateGroup(newGroup);
    toast.success("Cihaz grubu başarıyla oluşturuldu");
    onOpenChange(false);
    setGroupName("");
    setDescription("");
    setSelectedDevices([]);
  };

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cihaz Grubu Oluştur</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Grup Adı</label>
            <Input
              placeholder="Grup adı girin"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Açıklama</label>
            <Textarea
              placeholder="Grup açıklaması girin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cihazlar ({selectedDevices.length} seçili)
            </label>
            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="space-y-4">
                {mockDevices.map((device) => (
                  <div key={device.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => toggleDevice(device.id)}
                    />
                    <div>
                      <p className="font-medium">{device.branchName}</p>
                      <p className="text-sm text-gray-500">{device.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleCreateGroup}>
            Grup Oluştur ({selectedDevices.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}