import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { DeviceGroup } from "./DeviceGroupManagement";
import { Search } from "lucide-react";

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
const mockDevices: Device[] = Array.from({ length: 500 }, (_, i) => ({
  id: `${i + 1}`,
  branchName: `Branch ${i + 1}`,
  location: `Location ${Math.floor(i / 100) + 1}`,
}));

export function DeviceGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
}: DeviceGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    setSearchTerm("");
  };

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const filteredDevices = mockDevices.filter(device => 
    device.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cihaz Grubu Oluştur</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-grow overflow-hidden space-y-4">
          <div>
            <label className="text-sm font-medium">Grup Adı</label>
            <Input
              placeholder="Grup adı girin"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Açıklama</label>
            <Textarea
              placeholder="Grup açıklaması girin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex-grow flex flex-col min-h-0">
            <label className="text-sm font-medium mb-2">
              Cihazlar ({selectedDevices.length} seçili)
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cihaz ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-grow min-h-0 border rounded-md">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {filteredDevices.map((device) => (
                    <div 
                      key={device.id} 
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => toggleDevice(device.id)}
                    >
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
                  {filteredDevices.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setSearchTerm("");
            setSelectedDevices([]);
          }}>
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