import React, { useState } from 'react';
import { SearchBar } from "./SearchBar";
import { DeviceList } from "./DeviceList";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePushPlaylist } from "./usePushPlaylist";
import { useDeviceQuery } from "./useDeviceQuery";
import { toast } from "sonner";
import type { Device, DeviceCategory, DeviceStatus, DeviceSystemInfo, DeviceSchedule } from "@/pages/Manager/Devices/hooks/types";

// Helper function to validate device schedule
const validateDeviceSchedule = (schedule: any): DeviceSchedule => {
  if (!schedule) return {};
  
  // If it's a string, try to parse it
  if (typeof schedule === 'string') {
    try {
      schedule = JSON.parse(schedule);
    } catch {
      return {};
    }
  }

  return {
    powerOn: schedule.powerOn || undefined,
    powerOff: schedule.powerOff || undefined,
    ...schedule
  };
};

// Helper function to validate device category
const validateDeviceCategory = (category: string): DeviceCategory => {
  const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
  return validCategories.includes(category as DeviceCategory) 
    ? (category as DeviceCategory) 
    : 'player';
};

// Helper function to validate device status
const validateDeviceStatus = (status: string): DeviceStatus => {
  const validStatuses: DeviceStatus[] = ['online', 'offline'];
  return validStatuses.includes(status as DeviceStatus)
    ? (status as DeviceStatus)
    : 'offline';
};

// Helper function to validate system info
const validateSystemInfo = (systemInfo: any): DeviceSystemInfo => {
  if (!systemInfo) return {};
  
  if (typeof systemInfo === 'string') {
    try {
      systemInfo = JSON.parse(systemInfo);
    } catch {
      return {};
    }
  }

  return {
    version: systemInfo.version || undefined,
    cpu: systemInfo.cpu || undefined,
    memory: systemInfo.memory || undefined,
    os: systemInfo.os || undefined,
    network: Array.isArray(systemInfo.network) ? systemInfo.network : undefined,
    health: systemInfo.health || undefined
  };
};

export function PushPlaylistDialog({ 
  isOpen, 
  onClose, 
  playlistTitle, 
  playlistId 
}: {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}) {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSyncing, handlePush } = usePushPlaylist(playlistId, playlistTitle, onClose);
  const { data: rawDevices = [], isLoading } = useDeviceQuery();

  // Transform and validate device data
  const devices: Device[] = rawDevices.map(device => ({
    ...device,
    category: validateDeviceCategory(device.category),
    status: validateDeviceStatus(device.status),
    system_info: validateSystemInfo(device.system_info),
    schedule: validateDeviceSchedule(device.schedule)
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