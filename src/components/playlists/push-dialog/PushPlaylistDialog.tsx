import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePlaylistSync } from "@/hooks/usePlaylistSync";
import { DialogHeader } from "./DialogHeader";
import { SearchBar } from "./SearchBar";
import { DeviceList } from "./DeviceList";
import { DialogFooter } from "./DialogFooter";
import { toast } from "sonner";
import { useDeviceQuery } from "./useDeviceQuery";
import type { PushDialogProps } from "./types";
import type { DeviceCategory } from "@/pages/Manager/Devices/hooks/types";

export function PushPlaylistDialog({ 
  isOpen, 
  onClose, 
  playlistTitle, 
  playlistId 
}: PushDialogProps) {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSyncing, handlePush } = usePlaylistSync(playlistId);
  const { data: devices = [], isLoading } = useDeviceQuery();

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
            selectedTokens={selectedTokens}
            isSyncing={isSyncing}
            onCancel={onClose}
            onPush={handleDevicePush}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}