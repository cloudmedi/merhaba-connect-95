import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Music, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
    loadOfflinePlaylists();
  }, []);

  const loadOfflinePlaylists = async () => {
    try {
      const result = await window.electronAPI.getOfflinePlaylists();
      setPlaylists(result);
    } catch (error) {
      console.error('Error loading playlists:', error);
      toast.error('Playlistler yüklenirken hata oluştu');
    }
  };

  const handleSync = async (playlist: any) => {
    try {
      setSyncStatus(prev => ({
        ...prev,
        [playlist.id]: {
          playlistId: playlist.id,
          name: playlist.name,
          progress: 0,
          status: 'syncing'
        }
      }));

      const result = await window.electronAPI.syncPlaylist(playlist);
      
      if (result.success) {
        setSyncStatus(prev => ({
          ...prev,
          [playlist.id]: {
            ...prev[playlist.id],
            progress: 100,
            status: 'completed'
          }
        }));
        toast.success(`${playlist.name} başarıyla senkronize edildi`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus(prev => ({
        ...prev,
        [playlist.id]: {
          ...prev[playlist.id],
          status: 'error'
        }
      }));
      toast.error(`${playlist.name} senkronizasyonu başarısız`);
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

  const checkDownloadProgress = async (songIds: string[]) => {
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Offline Playlistler</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadOfflinePlaylists}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playlists.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Henüz offline playlist bulunmuyor
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
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSync(playlist)}
                    disabled={syncStatus[playlist.id]?.status === 'syncing'}
                  >
                    Senkronize Et
                  </Button>
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