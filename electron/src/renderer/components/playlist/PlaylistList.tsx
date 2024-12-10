import React from 'react';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RefreshCw, Music, Check, AlertCircle } from 'lucide-react';

interface PlaylistListProps {
  playlists: any[];
  syncStatus: Record<string, {
    playlistId: string;
    name: string;
    progress: number;
    status: 'pending' | 'syncing' | 'completed' | 'error';
  }>;
  onPlaylistSelect?: (playlist: any) => void;
  currentPlaylistId?: string;
}

export function PlaylistList({
  playlists,
  syncStatus,
  onPlaylistSelect,
  currentPlaylistId
}: PlaylistListProps) {
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
        <CardTitle>Offline Playlistler</CardTitle>
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
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                  currentPlaylistId === playlist.id ? 'bg-purple-50' : ''
                }`}
                onClick={() => onPlaylistSelect?.(playlist)}
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
        </div>
      </CardContent>
    </Card>
  );
}