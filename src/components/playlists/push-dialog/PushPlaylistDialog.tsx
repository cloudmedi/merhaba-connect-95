import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { DeviceList } from "./DeviceList";
import { SearchBar } from "./SearchBar";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { usePushPlaylist } from "./usePushPlaylist";
import { useDeviceQuery } from "./useDeviceQuery";
import { toast } from "sonner";
import type { Device, DeviceCategory } from "@/pages/Manager/Devices/hooks/types";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}

// Helper function to validate device category
const validateDeviceCategory = (category: string): DeviceCategory => {
  const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
  return validCategories.includes(category as DeviceCategory) 
    ? (category as DeviceCategory) 
    : 'player'; // Default to 'player' if invalid category
};

export function PushPlaylistDialog({ 
  isOpen, 
  onClose, 
  playlistTitle, 
  playlistId 
}: PushPlaylistDialogProps) {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSyncing, handlePush } = usePushPlaylist(playlistId, playlistTitle, onClose);
  const { data: rawDevices = [], isLoading } = useDeviceQuery();

  // Transform and validate device data
  const devices: Device[] = rawDevices.map(device => ({
    ...device,
    category: validateDeviceCategory(device.category)
  }));

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedTokens.length === filteredDevices.length) {
      setSelectedTokens([]);
    } else {
      setSelectedTokens(filteredDevices.map(d => d.token || '').filter(Boolean));
    }
  };

  const handleDevicePush = async () => {
    if (selectedTokens.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      console.log('Starting playlist sync for device tokens:', selectedTokens);
      const result = await handlePush(selectedTokens);
      if (result.success) {
        toast.success(`Playlist ${selectedTokens.length} cihaza başarıyla gönderildi`);
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
            selectedCount={selectedTokens.length}
            totalCount={filteredDevices.length}
          />

          <DeviceList
            isLoading={isLoading}
            devices={filteredDevices}
            selectedTokens={selectedTokens}
            onToggleDevice={(token) => {
              if (token) {
                setSelectedTokens(prev =>
                  prev.includes(token)
                    ? prev.filter(t => t !== token)
                    : [...prev, token]
                );
              }
            }}
          />

          <DialogFooter
            selectedCount={selectedTokens.length}
            isSyncing={isSyncing}
            onCancel={onClose}
            onPush={handleDevicePush}
            selectedTokens={selectedTokens}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}