import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Computer, Download, Music, Play } from "lucide-react";
import { toast } from "sonner";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    electronAPI: {
      registerDevice: (deviceInfo: any) => Promise<any>;
      getDeviceId: () => Promise<string>;
      onSyncStatusChange: (callback: (status: string) => void) => void;
    };
  }
}

interface OfflinePlaylist {
  id: string;
  playlist: {
    id: string;
    name: string;
    artwork_url: string;
    songs: any[];
  };
  sync_status: string;
  last_synced_at: string;
}

export function OfflinePlayerApp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('idle');
  const [playlists, setPlaylists] = useState<OfflinePlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);

  useEffect(() => {
    // Check if device is already registered
    window.electronAPI.getDeviceId()
      .then((deviceId) => {
        if (deviceId) {
          setIsRegistered(true);
          fetchOfflinePlaylists(deviceId);
        }
      })
      .catch(console.error);

    // Listen for sync status changes
    window.electronAPI.onSyncStatusChange((status) => {
      setSyncStatus(status);
      if (status === 'completed') {
        toast.success('Sync completed successfully');
      } else if (status === 'error') {
        toast.error('Sync failed');
      }
    });
  }, []);

  const fetchOfflinePlaylists = async (deviceId: string) => {
    try {
      const { data: offlinePlaylists, error } = await supabase
        .from('offline_playlists')
        .select(`
          id,
          sync_status,
          last_synced_at,
          playlist:playlists (
            id,
            name,
            artwork_url,
            songs:playlist_songs (
              songs (
                id,
                title,
                artist,
                duration,
                file_url,
                bunny_id
              )
            )
          )
        `)
        .eq('device_id', deviceId);

      if (error) throw error;
      setPlaylists(offlinePlaylists || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    }
  };

  const handleRegister = async () => {
    try {
      const deviceInfo = {
        id: crypto.randomUUID(),
        name: 'Offline Player',
        type: 'desktop'
      };

      await window.electronAPI.registerDevice(deviceInfo);
      setIsRegistered(true);
      toast.success('Device registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register device');
    }
  };

  const handlePlayPlaylist = (playlist: any) => {
    setCurrentPlaylist({
      title: playlist.name,
      artwork: playlist.artwork_url,
      songs: playlist.songs.map((ps: any) => ({
        id: ps.songs.id,
        title: ps.songs.title,
        artist: ps.songs.artist || "Unknown Artist",
        duration: ps.songs.duration?.toString() || "0:00",
        file_url: ps.songs.file_url,
        bunny_id: ps.songs.bunny_id
      }))
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Computer className="w-6 h-6" />
            Offline Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isRegistered ? (
            <div className="text-center">
              <Button onClick={handleRegister}>
                Register Device
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-gray-500" />
                      <span>Playlists</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{playlists.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span>Sync Status</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 capitalize">{syncStatus}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Offline Playlists</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {playlists.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="relative aspect-square">
                            <img
                              src={item.playlist.artwork_url || "/placeholder.svg"}
                              alt={item.playlist.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:scale-110 hover:bg-white/30 transition-all duration-300"
                                onClick={() => handlePlayPlaylist(item.playlist)}
                              >
                                <Play className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium truncate">{item.playlist.name}</h3>
                            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                              <span>Last synced: {new Date(item.last_synced_at).toLocaleDateString()}</span>
                              <span className="capitalize">{item.sync_status}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {currentPlaylist && (
        <MusicPlayer
          playlist={currentPlaylist}
          onClose={() => setCurrentPlaylist(null)}
          autoPlay={true}
        />
      )}
    </div>
  );
}