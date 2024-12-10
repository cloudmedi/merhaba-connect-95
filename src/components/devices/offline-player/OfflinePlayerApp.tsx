import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Computer } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { DeviceRegistration } from './components/DeviceRegistration';
import { SyncStatus } from './components/SyncStatus';
import { PlaylistGrid } from './components/PlaylistGrid';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SystemInfo } from '../../../../electron/src/types/electron';

export function OfflinePlayerApp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    // Check if device is already registered
    window.electronAPI.getDeviceId()
      .then((id) => {
        if (id) {
          setIsRegistered(true);
          setDeviceId(id);
          fetchDevicePlaylists(id);
        }
      })
      .catch(console.error);
  }, []);

  const fetchDevicePlaylists = async (id: string) => {
    try {
      const { data: devicePlaylists, error } = await supabase
        .from('playlists')
        .select(`
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
        `)
        .eq('devices.id', id)
        .order('created_at');

      if (error) throw error;
      setPlaylists(devicePlaylists || []);
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

    const result = await window.electronAPI.registerDevice(deviceInfo);
    setIsRegistered(true);
    setDeviceId(deviceInfo.id);
    setToken(result.token);
    toast.success(`Device registered successfully. Your token is: ${result.token}`);
  };

  const handlePlayPlaylist = (playlist: any) => {
    setCurrentPlaylist({
      id: playlist.id,
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
              {token && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-mono text-xl text-center">{token}</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    This is your device token. Keep it safe!
                  </p>
                </div>
              )}
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
          playlist={{
            id: currentPlaylist.id,
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork,
            songs: currentPlaylist.songs
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}
