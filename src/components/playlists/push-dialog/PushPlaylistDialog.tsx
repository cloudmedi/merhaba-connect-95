import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DeviceList } from "./DeviceList";
import { SearchBar } from "./SearchBar";
import { DialogFooter } from "./DialogFooter";
import { usePushPlaylist } from "./usePushPlaylist";

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
  console.log('PushPlaylistDialog rendered with:', { playlistId, playlistTitle, isOpen });
  
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSyncing, handlePush } = usePushPlaylist(playlistId, playlistTitle, onClose);

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      console.log('Fetching devices...');
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) {
        console.log('No company ID found');
        return [];
      }

      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }
      
      console.log('Devices fetched:', data);
      return data;
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    console.log('Toggle select all clicked');
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const handleDeviceToggle = (deviceId: string) => {
    console.log('Device toggled:', deviceId);
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Push Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAll={handleSelectAll}
            selectedCount={selectedDevices.length}
            totalCount={filteredDevices.length}
          />

          <DeviceList
            devices={filteredDevices}
            selectedDevices={selectedDevices}
            onToggleDevice={handleDeviceToggle}
            isLoading={isLoading}
          />

          <DialogFooter
            selectedCount={selectedDevices.length}
            isSyncing={isSyncing}
            onCancel={onClose}
            onPush={handlePush}
            selectedDevices={selectedDevices}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}