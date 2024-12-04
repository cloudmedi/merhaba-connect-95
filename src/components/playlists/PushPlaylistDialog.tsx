import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader } from "./push-dialog/DialogHeader";
import { SearchBar } from "./push-dialog/SearchBar";
import { DeviceList } from "./push-dialog/DeviceList";
import { GroupList } from "./push-dialog/GroupList";
import { DialogFooter } from "./push-dialog/DialogFooter";
import { usePushDialogData } from "./push-dialog/usePushDialogData";
import type { PushDialogDevice } from "./push-dialog/deviceTypes";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("devices");

  const { devices, groups, isLoadingDevices, isLoadingGroups } = usePushDialogData();

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (activeTab === "devices") {
      if (selectedDevices.length === filteredDevices.length) {
        setSelectedDevices([]);
      } else {
        setSelectedDevices(filteredDevices.map(d => d.id));
      }
    }
  };

  const handleToggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectGroup = (groupId: string, isSelected: boolean) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const deviceIds = group.branch_group_assignments?.flatMap(
      assignment => assignment.branches?.devices?.map(d => d.id) || []
    ) || [];

    if (isSelected) {
      setSelectedDevices(prev => [...new Set([...prev, ...deviceIds])]);
    } else {
      setSelectedDevices(prev => prev.filter(id => !deviceIds.includes(id)));
    }
  };

  const handlePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      // Implement playlist push logic here
      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza gönderildi`);
      onClose();
      setSelectedDevices([]);
    } catch (error) {
      toast.error("Playlist gönderilirken bir hata oluştu");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader onClose={onClose} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">Cihazlar</TabsTrigger>
            <TabsTrigger value="groups">Gruplar</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAll={activeTab === "devices" ? handleSelectAll : undefined}
            selectedCount={selectedDevices.length}
            totalCount={filteredDevices.length}
          />

          {activeTab === "devices" ? (
            <DeviceList
              devices={filteredDevices}
              selectedDevices={selectedDevices}
              onToggleDevice={handleToggleDevice}
            />
          ) : (
            <GroupList
              groups={filteredGroups}
              selectedDevices={selectedDevices}
              onSelectGroup={handleSelectGroup}
            />
          )}

          <DialogFooter
            selectedCount={selectedDevices.length}
            onCancel={onClose}
            onPush={handlePush}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}