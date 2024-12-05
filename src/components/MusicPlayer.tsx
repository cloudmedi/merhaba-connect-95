import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AudioPlayer } from "./music/AudioPlayer";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { PlayerControls } from "./music/PlayerControls";
import { ProgressBar } from "./music/ProgressBar";
import { VolumeControl } from "./music/VolumeControl";
import { cn } from "@/lib/utils";

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
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

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

  if (!playlist.songs || playlist.songs.length === 0) {
    toast.error("No songs available in this playlist");
    onClose();
    return null;
  }

  const currentSong = playlist.songs[currentSongIndex];

  const handleNext = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      let nextIndex;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * playlist.songs.length);
      } else {
        nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
      }
      setCurrentSongIndex(nextIndex);
      onSongChange?.(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      let prevIndex;
      if (isShuffle) {
        prevIndex = Math.floor(Math.random() * playlist.songs.length);
      } else {
        prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
      }
      setCurrentSongIndex(prevIndex);
      onSongChange?.(prevIndex);
    }
  };

  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 75 : 0);
  };

  const handleTimeUpdate = (time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
    setProgress((time / dur) * 100);
  };

  const handleProgressChange = (values: number[]) => {
    const newProgress = values[0];
    setProgress(newProgress);
    const newTime = (duration * newProgress) / 100;
    setCurrentTime(newTime);
  };

  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=400&quality=85&format=webp`;
  };

  const getAudioUrl = (song: any) => {
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
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up",
      isMiniPlayer && "h-20"
    )}>
      <div 
        className="absolute inset-0 bg-cover bg-center music-player-backdrop"
        style={{ 
          backgroundImage: `url(${getOptimizedImageUrl(playlist.artwork)})`,
          filter: 'blur(80px)',
          transform: 'scale(1.2)',
          opacity: '0.15'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-[#121212]/90" />
      
      <div className="relative px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 flex-1 min-w-[180px] max-w-[300px]">
          <img 
            src={getOptimizedImageUrl(playlist.artwork)} 
            alt={currentSong?.title}
            className="w-14 h-14 rounded-md object-cover shadow-lg"
          />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {currentSong?.title}
            </h3>
            <p className="text-white/60 text-xs font-normal truncate">
              {currentSong?.artist}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-4 space-y-2">
          <PlayerControls
            isPlaying={isPlaying}
            isRepeat={isRepeat}
            isShuffle={isShuffle}
            isMiniPlayer={isMiniPlayer}
            onPrevious={handlePrevious}
            onPlayPause={() => handlePlayPause(!isPlaying)}
            onNext={handleNext}
            onRepeatToggle={() => setIsRepeat(!isRepeat)}
            onShuffleToggle={() => setIsShuffle(!isShuffle)}
            onPlaylistToggle={() => {}}
            onMiniPlayerToggle={() => setIsMiniPlayer(!isMiniPlayer)}
          />
          
          {!isMiniPlayer && (
            <ProgressBar
              progress={progress}
              duration={duration}
              currentTime={currentTime}
              onProgressChange={handleProgressChange}
            />
          )}
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end min-w-[180px]">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={toggleMute}
          />
          
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

      <AudioPlayer
        audioUrl={getAudioUrl(currentSong)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        volume={isMuted ? 0 : volume / 100}
        autoPlay={autoPlay}
        onPlayStateChange={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        repeat={isRepeat}
      />
    </div>
  );
}