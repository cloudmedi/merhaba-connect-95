import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { PlayerControls } from "./music/PlayerControls";
import { TrackInfo } from "./music/TrackInfo";

interface Song {
  id: string | number;
  title: string;
  artist: string;
  duration: string | number;
  file_url: string;
  bunny_id?: string;
}

interface Playlist {
  id?: string;  // Made optional since not all contexts provide it
  title: string;
  artwork: string;
  songs?: Song[];
}

interface MusicPlayerProps {
  playlist: Playlist;
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
    refetchInterval: 1000
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

  const getAudioUrl = (song: Song) => {
    if (downloadStatus?.downloaded && downloadStatus.path) {
      return `file://${downloadStatus.path}`;
    }
    
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
      <div 
        className="absolute inset-0 bg-cover bg-center music-player-backdrop"
        style={{ 
          backgroundImage: `url(${playlist.artwork})`,
          filter: 'blur(80px)',
          transform: 'scale(1.2)',
          opacity: '0.15'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-[#121212]/90" />

      <div className="relative px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        <TrackInfo
          artwork={playlist.artwork}
          title={currentSong.title}
          artist={currentSong.artist}
          isOffline={isOffline}
          downloadStatus={currentSongDownloadStatus}
        />

        <div className="flex-1 max-w-2xl px-4">
          <PlayerControls
            audioUrl={getAudioUrl(currentSong)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onPlayStateChange={handlePlayPause}
            autoPlay={autoPlay}
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
  );
}