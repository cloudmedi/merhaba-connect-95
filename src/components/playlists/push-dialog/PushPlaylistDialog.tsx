import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DeviceList } from "./DeviceList";
import { usePlaylistSync } from "@/hooks/usePlaylistSync";

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
  const { isSyncing, handleSync } = usePlaylistSync(playlistId, playlistTitle);

  const handleSelectAll = (devices: string[]) => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices);
    }
  };

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handlePush = async () => {
    await handleSync(selectedDevices);
    if (!isSyncing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Push Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cihaz ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleSelectAll(selectedDevices)}
              className="whitespace-nowrap"
            >
              {selectedDevices.length === 0 ? "Tümünü Seç" : "Seçimi Kaldır"}
            </Button>
          </div>

          <DeviceList
            searchQuery={searchQuery}
            selectedDevices={selectedDevices}
            onToggleDevice={handleDeviceToggle}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button onClick={handlePush} disabled={isSyncing}>
                {isSyncing ? "Gönderiliyor..." : "Cihazlara Gönder"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}