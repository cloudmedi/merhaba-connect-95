import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DialogHeader } from "./DialogHeader";
import { SearchBar } from "./SearchBar";
import { DeviceList } from "./DeviceList";
import { DialogFooter } from "./DialogFooter";
import { PushDialogDevice, PushDialogProps } from "./types";

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle, playlistId }: PushDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

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
            name
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

  const checkDownloadProgress = useCallback(async (songIds: string[]) => {
    const interval = setInterval(async () => {
      const newProgress: { [key: string]: number } = {};
      let allCompleted = true;

      for (const songId of songIds) {
        const progress = await window.electronAPI.getDownloadProgress(songId);
        newProgress[songId] = progress;
        if (progress < 100) allCompleted = false;
      }

      setDownloadProgress(newProgress);

      if (allCompleted) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      setIsSyncing(true);
      toast.loading(`Playlist ${selectedDevices.length} cihaza gönderiliyor...`);

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

      const songs = playlist.playlist_songs.map((ps: any) => ({
        ...ps.songs,
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url
      }));

      const songIds = songs.map((s: any) => s.id);
      const cleanup = await checkDownloadProgress(songIds);

      for (const deviceId of selectedDevices) {
        console.log(`Sending playlist to device ${deviceId}`);
        
        const result = await window.electronAPI.syncPlaylist({
          id: playlist.id,
          name: playlist.name,
          songs: songs
        });

        if (!result.success) {
          console.error(`Failed to sync playlist to device ${deviceId}:`, result.error);
          toast.error(`${deviceId} cihazına gönderilirken hata oluştu: ${result.error}`);
        }
      }

      cleanup();
      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza başarıyla gönderildi`);
      onClose();
      setSelectedDevices([]);
    } catch (error: any) {
      console.error('Error pushing playlist:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
    } finally {
      setIsSyncing(false);
      setDownloadProgress({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader />

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

          {Object.keys(downloadProgress).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">İndirme Durumu:</p>
              {Object.entries(downloadProgress).map(([songId, progress]) => (
                <div key={songId} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Şarkı ID: {songId}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

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