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
      // Create offline playlist entries for each selected device
      const offlinePlaylistPromises = selectedDevices.map(async (deviceId) => {
        // First, check if an offline_player exists for this device
        let { data: offlinePlayer } = await supabase
          .from('offline_players')
          .select('id')
          .eq('device_id', deviceId)
          .single();

        // If no offline player exists, create one
        if (!offlinePlayer) {
          const { data: newPlayer, error: playerError } = await supabase
            .from('offline_players')
            .insert({
              device_id: deviceId,
              sync_status: 'pending',
              settings: {
                autoSync: true,
                syncInterval: 30,
                maxStorageSize: 1024 * 1024 * 1024 // 1GB default
              }
            })
            .select()
            .single();

          if (playerError) throw playerError;
          offlinePlayer = newPlayer;
        }

        // Create or update offline playlist entry
        const { error: playlistError } = await supabase
          .from('offline_playlists')
          .upsert({
            device_id: offlinePlayer.id,
            playlist_id: playlistId,
            sync_status: 'pending',
            last_synced_at: new Date().toISOString()
          });

        if (playlistError) throw playlistError;

        // Get all songs from the playlist
        const { data: playlistSongs, error: songsError } = await supabase
          .from('playlist_songs')
          .select('songs(*)')
          .eq('playlist_id', playlistId);

        if (songsError) throw songsError;

        // Create offline song entries for each song
        const songPromises = playlistSongs?.map(async (ps) => {
          const { error: offlineSongError } = await supabase
            .from('offline_songs')
            .upsert({
              device_id: offlinePlayer.id,
              song_id: ps.songs.id,
              sync_status: 'pending',
              last_synced_at: new Date().toISOString()
            });

          if (offlineSongError) throw offlineSongError;
        });

        if (songPromises) {
          await Promise.all(songPromises);
        }
      });

      await Promise.all(offlinePlaylistPromises);

      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza gönderildi`);
      onClose();
      setSelectedDevices([]);
    } catch (error) {
      console.error('Error pushing playlist:', error);
      toast.error("Playlist gönderilirken bir hata oluştu");
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
                        {device.branches?.name && (
                          <>
                            <span>{device.branches.name}</span>
                            <span>•</span>
                          </>
                        )}
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
              <Button onClick={handlePush}>
                Cihazlara Gönder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}