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
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSyncing, handlePush } = usePushPlaylist(playlistId, playlistTitle, onClose);
  const { data: devices = [], isLoading } = useDeviceQuery();

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedTokens.length === filteredDevices.length) {
      setSelectedTokens([]);
    } else {
      setSelectedTokens(filteredDevices.map(d => d.token).filter(Boolean) as string[]);
    }
  };

  const handleDevicePush = async () => {
    if (selectedTokens.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
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