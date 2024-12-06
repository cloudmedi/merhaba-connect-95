import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DeviceList } from "./DeviceList";
import { SearchBar } from "./SearchBar";
import { DialogFooter } from "./DialogFooter";
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
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

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

      if (error) throw error;
      return data;
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

      // Format songs data
      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      // WebSocket bağlantısını kur
      const { data: { session } } = await supabase.auth.getSession();
      const ws = new WebSocket(
        `${process.env.SUPABASE_URL}/functions/v1/sync-playlist?token=${session?.access_token}`
      );

      ws.onopen = async () => {
        console.log('WebSocket connection opened');
        
        // Her cihaz için senkronizasyon mesajı gönder
        for (const deviceId of selectedDevices) {
          console.log(`Sending playlist to device ${deviceId}`);
          
          ws.send(JSON.stringify({
            type: 'sync_playlist',
            payload: {
              deviceId,
              playlist: {
                id: playlist.id,
                name: playlist.name,
                songs: songs
              }
            }
          }));
        }
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Received response:', response);

        if (response.type === 'sync_success') {
          toast.success(`Playlist ${response.payload.deviceId} cihazına başarıyla gönderildi`);
        } else if (response.type === 'error') {
          toast.error(`Hata: ${response.payload}`);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Bağlantı hatası oluştu');
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsSyncing(false);
        onClose();
        setSelectedDevices([]);
      };

    } catch (error: any) {
      console.error('Error pushing playlist:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
      setIsSyncing(false);
    }
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
            onToggleDevice={(deviceId) => {
              setSelectedDevices(prev =>
                prev.includes(deviceId)
                  ? prev.filter(id => id !== deviceId)
                  : [...prev, deviceId]
              );
            }}
            isLoading={isLoading}
          />

          <DialogFooter
            selectedCount={selectedDevices.length}
            isSyncing={isSyncing}
            onClose={onClose}
            onPush={handlePush}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}