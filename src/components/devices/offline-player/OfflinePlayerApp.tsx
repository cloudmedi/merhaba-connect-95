import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Computer } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { DeviceRegistration } from './components/DeviceRegistration';
import { SyncStatus } from './components/SyncStatus';
import { PlaylistGrid } from './components/PlaylistGrid';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { supabase } from "@/integrations/supabase/client";

export function OfflinePlayerApp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  
  const { isSyncing, syncPlaylists } = useOfflineSync(deviceId);

  useEffect(() => {
    // Check if device is already registered
    window.electronAPI.getDeviceId()
      .then((id) => {
        if (id) {
          setIsRegistered(true);
          setDeviceId(id);
          fetchOfflinePlaylists(id);
        }
      })
      .catch(console.error);
  }, []);

  const fetchOfflinePlaylists = async (id: string) => {
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
        .eq('device_id', id);

      if (error) throw error;
      setPlaylists(offlinePlaylists || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleRegister = async () => {
    const deviceInfo = {
      id: crypto.randomUUID(),
      name: 'Offline Player',
      type: 'desktop'
    };

    await window.electronAPI.registerDevice(deviceInfo);
    setIsRegistered(true);
    setDeviceId(deviceInfo.id);
    await syncPlaylists();
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
            <DeviceRegistration onRegister={handleRegister} />
          ) : (
            <div className="space-y-8">
              <SyncStatus 
                syncStatus={isSyncing ? 'syncing' : 'idle'} 
                playlistCount={playlists.length} 
              />
              <PlaylistGrid 
                playlists={playlists}
                onPlayPlaylist={handlePlayPlaylist}
              />
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