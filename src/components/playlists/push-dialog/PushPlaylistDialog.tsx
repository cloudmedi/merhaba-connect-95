import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DialogHeader } from "./DialogHeader";
import { SearchBar } from "./SearchBar";
import { DeviceList } from "./DeviceList";
import { DialogFooter } from "./DialogFooter";
import { PushDialogDevice } from "./types";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle, playlistId }: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) {
        return [];
      }

      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name,
            company_id
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) throw error;
      return data as PushDialogDevice[];
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const handlePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      setIsSyncing(true);
      toast.loading(`Playlist ${selectedDevices.length} cihaza gönderiliyor...`);

      // Get playlist details with songs
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_songs (
            songs (
              id,
              title,
              artist,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('id', playlistId)
        .single();

      if (playlistError) throw playlistError;

      // Send playlist directly to each selected device
      for (const deviceId of selectedDevices) {
        console.log(`Sending playlist to device ${deviceId}`);
        
        const result = await window.electronAPI.syncPlaylist({
          id: playlist.id,
          name: playlist.name,
          songs: playlist.playlist_songs.map((ps: any) => ps.songs)
        });

        if (!result.success) {
          toast.error(`${deviceId} cihazına gönderilirken hata oluştu: ${result.error}`);
        }
      }

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
      onClose();
      setSelectedDevices([]);
    } catch (error: any) {
      console.error('Error pushing playlist:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader onClose={onClose} />

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
            onCancel={onClose}
            onPush={handlePush}
            isSyncing={isSyncing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}