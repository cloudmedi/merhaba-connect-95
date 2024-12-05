import { useState, useEffect, useCallback, memo } from "react";
import { X } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeControls } from "./VolumeControls";
import { TrackInfo } from "./TrackInfo";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getOptimizedImageUrl, getAudioUrl } from "./utils";
import { ErrorBoundary } from "./ErrorBoundary";
import { MusicPlayerProvider, useMusicPlayer } from "./MusicPlayerContext";
import type { MusicPlayerProps } from "./types";

const MusicPlayerContent = memo(function MusicPlayerContent({ 
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

  const handleNext = useCallback(() => {
    if (playlist.songs && playlist.songs.length > 0) {
      const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      onSongChange?.(nextIndex);
    }
  }, [currentSongIndex, playlist.songs, onSongChange]);

  const handlePrevious = useCallback(() => {
    if (playlist.songs && playlist.songs.length > 0) {
      const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      onSongChange?.(prevIndex);
    }
  }, [currentSongIndex, playlist.songs, onSongChange]);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  }, [onPlayStateChange]);

  const handleVolumeChange = useCallback((values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    setVolume(isMuted ? 75 : 0);
  }, [isMuted]);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up"
      role="region"
      aria-label="Music player"
    >
      <ErrorBoundary>
        <div 
          className="absolute inset-0 bg-cover bg-center music-player-backdrop"
          style={{ 
            backgroundImage: `url(${getOptimizedImageUrl(playlist.artwork)})`,
            filter: 'blur(80px)',
            transform: 'scale(1.2)',
            opacity: '0.15'
          }}
          aria-hidden="true"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-[#121212]/90" aria-hidden="true" />
        
        <div className="relative px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4 flex-1 min-w-[180px] max-w-[300px]">
            <TrackInfo
              artwork={getOptimizedImageUrl(playlist.artwork)}
              title={currentSong?.title || ""}
              artist={currentSong?.artist || "Unknown Artist"}
            />
          </div>

          <div className="flex-1 max-w-2xl px-4">
            <AudioPlayer
              audioUrl={getAudioUrl(currentSong)}
              onNext={handleNext}
              onPrevious={handlePrevious}
              volume={isMuted ? 0 : volume / 100}
              autoPlay={autoPlay}
              onPlayStateChange={handlePlayStateChange}
            />
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end min-w-[180px]">
            <VolumeControls
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
              aria-label="Close player"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
});

export const MusicPlayer = memo(function MusicPlayer(props: MusicPlayerProps) {
  return (
    <MusicPlayerProvider 
      initialPlaylist={props.playlist}
      initialSongIndex={props.initialSongIndex}
    >
      <MusicPlayerContent {...props} />
    </MusicPlayerProvider>
  );
});
