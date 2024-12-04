import { useState, useEffect } from "react";
import { X, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";
import { AudioPlayer } from "./music/AudioPlayer";
import { toast } from "sonner";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { DownloadIndicator } from "./music/DownloadIndicator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MusicPlayerProps {
  playlist: {
    title: string;
    artwork: string;
    songs?: Array<{
      id: string | number;
      title: string;
      artist: string;
      duration: string | number;
      file_url: string;
      bunny_id?: string;
    }>;
  };
  onClose: () => void;
  initialSongIndex?: number;
  autoPlay?: boolean;
  onSongChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  currentSongId?: string | number;
}

export function MusicPlayer({ 
  playlist, 
  onClose, 
  initialSongIndex = 0,
  autoPlay = true,
  onSongChange,
  onPlayStateChange,
  currentSongId
}: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isOffline, setIsOffline] = useState(false);
  
  // Query download status for current song
  const { data: downloadStatus } = useQuery({
    queryKey: ['song-download-status', currentSongId],
    queryFn: async () => {
      if (!currentSongId) return null;
      return window.electronAPI.checkSongDownloaded(currentSongId.toString());
    },
    enabled: !!currentSongId
  });

  // Query download queue status for playlist
  const { data: queueStatus } = useQuery({
    queryKey: ['playlist-download-status', playlist?.id],
    queryFn: async () => {
      if (!playlist?.id) return null;
      return window.electronAPI.getDownloadStatus(playlist.id);
    },
    enabled: !!playlist?.id,
    refetchInterval: 1000 // Poll every second for updates
  });

  useEffect(() => {
    if (currentSongId && playlist.songs) {
      const index = playlist.songs.findIndex(song => song.id === currentSongId);
      if (index !== -1) {
        setCurrentSongIndex(index);
      }
    }
  }, [currentSongId, playlist.songs]);

  useEffect(() => {
    setCurrentSongIndex(initialSongIndex);
  }, [initialSongIndex]);

  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!playlist.songs || playlist.songs.length === 0) {
    toast.error("No songs available in this playlist");
    onClose();
    return null;
  }

  const currentSong = playlist.songs[currentSongIndex];
  const currentSongDownloadStatus = queueStatus?.songs?.find(s => s.id === currentSong.id);

  const handleNext = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      onSongChange?.(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      onSongChange?.(prevIndex);
    }
  };

  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 75 : 0);
  };

  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=400&quality=85&format=webp`;
  };

  const getAudioUrl = (song: any) => {
    // If song is downloaded, use local path
    if (downloadStatus?.downloaded && downloadStatus.path) {
      return `file://${downloadStatus.path}`;
    }
    
    // Otherwise use Bunny CDN URL
    if (!song.file_url) {
      console.error('No file_url provided for song:', song);
      return '';
    }
    
    if (song.file_url.startsWith('http')) {
      return song.file_url;
    }
    
    if (song.bunny_id) {
      return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    }
    
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up">
      {/* Blurred background with artwork */}
      <div 
        className="absolute inset-0 bg-cover bg-center music-player-backdrop"
        style={{ 
          backgroundImage: `url(${getOptimizedImageUrl(playlist.artwork)})`,
          filter: 'blur(80px)',
          transform: 'scale(1.2)',
          opacity: '0.15'
        }}
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-[#121212]/90" />

      {/* Content */}
      <div className="relative px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 flex-1 min-w-[180px] max-w-[300px]">
          <div className="relative">
            <img 
              src={getOptimizedImageUrl(playlist.artwork)} 
              alt={currentSong?.title}
              className="w-14 h-14 rounded-md object-cover shadow-lg"
            />
            {/* Offline/Online indicator */}
            <div className="absolute -top-2 -right-2">
              {isOffline ? (
                <WifiOff className="w-4 h-4 text-red-500" />
              ) : (
                <Wifi className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-medium text-sm truncate hover:text-white/90 transition-colors cursor-default">
              {currentSong?.title}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-white/60 text-xs truncate hover:text-white/70 transition-colors cursor-default">
                {currentSong?.artist}
              </p>
              {currentSongDownloadStatus && (
                <DownloadIndicator 
                  status={currentSongDownloadStatus.status}
                  progress={currentSongDownloadStatus.progress}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-4">
          <AudioPlayer
            audioUrl={getAudioUrl(currentSong)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            volume={isMuted ? 0 : volume / 100}
            autoPlay={autoPlay}
            onPlayStateChange={handlePlayPause}
          />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end min-w-[180px]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
