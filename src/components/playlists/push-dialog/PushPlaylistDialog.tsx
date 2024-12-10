import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { DeviceList } from "./DeviceList";
import { SearchBar } from "./SearchBar";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { usePushPlaylist } from "./usePushPlaylist";
import { useDeviceQuery } from "./useDeviceQuery";
import { toast } from "sonner";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}

export function PushPlaylistDialog({ 
  isOpen, 
  onClose, 
  playlistTitle, 
  playlistId 
}: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSyncing, handlePush } = usePushPlaylist(playlistId, playlistTitle, onClose);
  const { data: devices = [], isLoading } = useDeviceQuery();

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const handleDevicePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      const result = await handlePush(selectedDevices);
      if (result.success) {
        toast.success(`Playlist ${selectedDevices.length} cihaza başarıyla gönderildi`);
        onClose();
      } else {
        toast.error(result.error || "Playlist gönderilirken bir hata oluştu");
      }
    } catch (error) {
      console.error('Push error:', error);
      toast.error("İşlem sırasında bir hata oluştu");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader title="Push Playlist" />

        <div className="space-y-4">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAll={handleSelectAll}
            selectedCount={selectedDevices.length}
            totalCount={filteredDevices.length}
          />

          <DeviceList
            isLoading={isLoading}
            devices={filteredDevices}
            selectedDevices={selectedDevices}
            onToggleDevice={(deviceId) => {
              setSelectedDevices(prev =>
                prev.includes(deviceId)
                  ? prev.filter(id => id !== deviceId)
                  : [...prev, deviceId]
              );
            }}
          />

          <DialogFooter
            selectedCount={selectedDevices.length}
            isSyncing={isSyncing}
            onCancel={onClose}
            onPush={handleDevicePush}
            selectedDevices={selectedDevices}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}