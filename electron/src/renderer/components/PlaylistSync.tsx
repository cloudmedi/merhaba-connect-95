import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Music, Check, AlertCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from './AudioPlayer';

interface SyncStatus {
  playlistId: string;
  name: string;
  progress: number;
  status: 'pending' | 'syncing' | 'completed' | 'error';
}

interface Song {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  bunny_id?: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface DownloadProgressData {
  songId: string;
  progress: number;
}

export function PlaylistSync() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [syncStatus, setSyncStatus] = useState<Record<string, SyncStatus>>({});
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    console.log('Setting up playlist sync listeners');
    
    const cleanup = window.electronAPI.onWebSocketMessage((data: any) => {
      console.log('WebSocket message received:', data);
      
      if (data.type === 'playlist_sync' && data.payload?.playlist) {
        const playlist = data.payload.playlist;
        console.log('New playlist received:', playlist);
        
        setPlaylists(prev => {
          const exists = prev.some(p => p.id === playlist.id);
          if (exists) {
            return prev.map(p => p.id === playlist.id ? playlist : p);
          }
          return [...prev, playlist];
        });

        setSyncStatus(prev => ({
          ...prev,
          [playlist.id]: {
            playlistId: playlist.id,
            name: playlist.name,
            progress: 0,
            status: 'syncing'
          }
        }));

        // Otomatik olarak yeni gelen playlist'i çal
        setCurrentPlaylist(playlist);
        setCurrentSongIndex(0);
        setIsPlaying(true);
      }
    });

    const downloadCleanup = window.electronAPI.onDownloadProgress((data: DownloadProgressData) => {
      console.log('Download progress update received:', data);
      setDownloadProgress(prev => ({
        ...prev,
        [data.songId]: data.progress
      }));
    });

    return () => {
      cleanup();
      downloadCleanup();
    };
  }, []);

  const handlePlayClick = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentPlaylist && currentSongIndex < currentPlaylist.songs.length - 1) {
      setCurrentSongIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(prev => prev - 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Offline Playlistler</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playlists.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                WebSocket bağlantısı bekleniyor...
              </p>
            ) : (
              playlists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(syncStatus[playlist.id]?.status)}
                    <div>
                      <h3 className="font-medium">{playlist.name}</h3>
                      <p className="text-sm text-gray-500">
                        {playlist.songs?.length || 0} şarkı
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {syncStatus[playlist.id]?.status === 'syncing' ? (
                      <Progress 
                        value={syncStatus[playlist.id]?.progress} 
                        className="w-[100px]"
                      />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlayClick(playlist)}
                        className="flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Çal
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {currentPlaylist && currentPlaylist.songs[currentSongIndex] && (
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  {currentPlaylist.songs[currentSongIndex].title}
                </h3>
                <p className="text-gray-400">
                  {currentPlaylist.songs[currentSongIndex].artist}
                </p>
              </div>
              
              <AudioPlayer
                audioUrl={currentPlaylist.songs[currentSongIndex].file_url}
                onNext={handleNext}
                onPrevious={handlePrevious}
                autoPlay={isPlaying}
                onPlayStateChange={setIsPlaying}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(downloadProgress).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">İndirme Durumu</h4>
            <div className="space-y-2">
              {Object.entries(downloadProgress).map(([songId, progress]) => (
                <div key={songId} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Şarkı ID: {songId}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}