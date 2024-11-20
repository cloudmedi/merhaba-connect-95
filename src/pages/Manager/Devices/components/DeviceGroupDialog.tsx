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
  selectedDevices: string[];
  onCreateGroup: (group: DeviceGroup) => void;
}

export function DeviceGroupDialog({
  open,
  onOpenChange,
  selectedDevices,
  onCreateGroup,
}: DeviceGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateGroup = () => {
    if (!groupName) {
      toast.error("Lütfen grup adı girin");
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
              Seçili Cihazlar ({selectedDevices.length})
            </label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {selectedDevices.map((deviceId) => (
                <div key={deviceId} className="flex items-center space-x-2 py-2">
                  <Checkbox checked disabled />
                  <span className="text-sm">Cihaz {deviceId}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleCreateGroup}>Grup Oluştur</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}