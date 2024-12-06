import React, { useEffect, useState } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, Music, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { WebSocketMessage } from '../../types/electron';

interface SyncStatus {
  playlistId: string;
  name: string;
  progress: number;
  status: 'pending' | 'syncing' | 'completed' | 'error';
}

export function PlaylistSync() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<Record<string, SyncStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    console.log('Setting up WebSocket listeners');
    const cleanup = window.electronAPI.onWebSocketMessage((data: WebSocketMessage) => {
      console.log('WebSocket message received:', data);
      if (data.type === 'sync_playlist' && data.payload.playlist) {
        const playlist = data.payload.playlist;
        setPlaylists(prev => [...prev, playlist]);
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

    const downloadCleanup = window.electronAPI.onDownloadProgress((data) => {
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
                {syncStatus[playlist.id]?.status === 'syncing' ? (
                  <Progress 
                    value={syncStatus[playlist.id]?.progress} 
                    className="w-[100px]"
                  />
                ) : null}
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