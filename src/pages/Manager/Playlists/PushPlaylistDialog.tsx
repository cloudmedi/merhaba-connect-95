import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

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

  // Basitleştirilmiş sorgu - sadece devices tablosundan veri çekiyoruz
  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      console.log('Fetching all devices...');
      const { data, error } = await supabase
        .from('devices')
        .select('*');

      if (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }

      console.log('Fetched devices:', data);
      return data;
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              onClick={handleSelectAll}
              className="whitespace-nowrap"
            >
              {selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
            </Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>
            ) : (
              <div className="space-y-4">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setSelectedDevices(prev =>
                        prev.includes(device.id)
                          ? prev.filter(id => id !== device.id)
                          : [...prev, device.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => {
                        setSelectedDevices(prev =>
                          prev.includes(device.id)
                            ? prev.filter(id => id !== device.id)
                            : [...prev, device.id]
                        );
                      }}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{device.name}</p>
                        <Badge 
                          variant={device.status === 'online' ? 'success' : 'secondary'}
                          className="ml-2"
                        >
                          {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{device.category}</span>
                        {device.last_seen && (
                          <>
                            <span>•</span>
                            <span>
                              Son görülme: {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

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