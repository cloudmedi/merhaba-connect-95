import React, { useEffect, useState } from 'react';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RefreshCw, Music, Check, AlertCircle } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { PlaylistList } from './playlist/PlaylistList';
import { DownloadProgress } from './playlist/DownloadProgress';
import type { Playlist, SyncStatus, DownloadProgressData } from '../types/playlist';
import { toast } from 'sonner';

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
        
        window.electronAPI.syncPlaylist(playlist)
          .then(result => {
            if (result.success) {
              console.log('Playlist synced successfully');
              toast.success('Playlist başarıyla senkronize edildi');
            } else {
              console.error('Failed to sync playlist:', result.error);
              toast.error('Playlist senkronizasyonu başarısız: ' + result.error);
            }
          })
          .catch(error => {
            console.error('Error syncing playlist:', error);
            toast.error('Senkronizasyon hatası: ' + error.message);
          });
      }
    });

    const downloadCleanup = window.electronAPI.onDownloadProgress((data: DownloadProgressData) => {
      console.log('Download progress update received:', data);
      setDownloadProgress(prev => ({
        ...prev,
        [data.songId]: data.progress
      }));
    });

    const playlistUpdateCleanup = window.electronAPI.onPlaylistUpdated((playlist: Playlist) => {
      console.log('Received updated playlist with local paths:', playlist);
      setPlaylists(prev => {
        const exists = prev.some(p => p.id === playlist.id);
        if (exists) {
          return prev.map(p => p.id === playlist.id ? playlist : p);
        }
        return [...prev, playlist];
      });
      
      if (!currentPlaylist) {
        setCurrentPlaylist(playlist);
        setCurrentSongIndex(0);
        setIsPlaying(true);
      }
    });

    return () => {
      cleanup();
      downloadCleanup();
      playlistUpdateCleanup();
    };
  }, [currentPlaylist]);

  const handlePlaylistSelect = (playlist: Playlist) => {
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

  return (
    <div className="space-y-8">
      <PlaylistList 
        playlists={playlists}
        syncStatus={syncStatus}
        onPlaylistSelect={handlePlaylistSelect}
        currentPlaylistId={currentPlaylist?.id}
      />

      {Object.keys(downloadProgress).length > 0 && (
        <DownloadProgress progress={downloadProgress} />
      )}

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
    </div>
  );
}
