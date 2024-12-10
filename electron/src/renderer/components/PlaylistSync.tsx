import React, { useEffect, useState } from 'react';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, Music, Check, AlertCircle } from 'lucide-react';
import type { WebSocketMessage } from '@/types/electron';

interface SyncStatus {
  playlistId: string;
  name: string;
  progress: number;
  status: 'pending' | 'syncing' | 'completed' | 'error';
}

interface DownloadProgressData {
  songId: string;
  progress: number;
}

export function PlaylistSync() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<Record<string, SyncStatus>>({});
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    console.log('PlaylistSync: Setting up WebSocket listeners');
    
    const cleanup = window.electronAPI.onWebSocketMessage((data: WebSocketMessage) => {
      console.log('WebSocket message received in PlaylistSync:', JSON.stringify(data, null, 2));
      
      if (data.type === 'sync_playlist' && data.payload.playlist) {
        const playlist = data.payload.playlist;
        console.log('New playlist received:', JSON.stringify(playlist, null, 2));
        
        setPlaylists(prev => {
          const exists = prev.some(p => p.id === playlist.id);
          console.log('Playlist exists:', exists);
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
      }
    });

    const downloadCleanup = window.electronAPI.onDownloadProgress((data: DownloadProgressData) => {
      console.log('Download progress update received:', data);
      
      setDownloadProgress(prev => ({
        ...prev,
        [data.songId]: data.progress
      }));

      if (data.progress === 100) {
        console.log('Download completed for song:', data.songId);
        setSyncStatus(prev => {
          const playlistId = Object.keys(prev).find(key => 
            prev[key].status === 'syncing'
          );
          if (playlistId) {
            console.log('Updating playlist status to completed:', playlistId);
            return {
              ...prev,
              [playlistId]: {
                ...prev[playlistId],
                status: 'completed'
              }
            };
          }
          return prev;
        });
      }
    });

    return () => {
      console.log('Cleaning up WebSocket listeners');
      cleanup();
      downloadCleanup();
    };
  }, []);

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
              Playlist senkronizasyonu bekleniyor...
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
                {syncStatus[playlist.id]?.status === 'syncing' && (
                  <Progress 
                    value={syncStatus[playlist.id]?.progress} 
                    className="w-[100px]"
                  />
                )}
              </div>
            ))
          )}

          {Object.keys(downloadProgress).length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <h4 className="font-medium">İndirme Durumu</h4>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}