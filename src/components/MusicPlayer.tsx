import { memo } from "react";
import { X } from "lucide-react";
import { AudioPlayer } from "@/components/music/AudioPlayer";
import { VolumeControls } from "@/components/music/VolumeControls";
import { TrackInfo } from "@/components/music/TrackInfo";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl } from "@/components/music/utils";
import { ErrorBoundary } from "@/components/music/ErrorBoundary";
import { MusicPlayerProvider, useMusicPlayer } from "@/components/music/MusicPlayerContext";
import type { MusicPlayerProps } from "@/components/music/types";

const MusicPlayerContent = memo(function MusicPlayerContent({ 
  playlist, 
  onClose, 
  initialSongIndex = 0,
  autoPlay = true,
  onSongChange,
  onPlayStateChange,
}: MusicPlayerProps) {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    toggleMute,
    setVolume,
    playNext,
    playPrevious,
    setCurrentSongIndex
  } = useMusicPlayer();

  if (!playlist.songs || playlist.songs.length === 0) {
    toast.error("No songs available in this playlist");
    onClose();
    return null;
  }

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

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
              onNext={playNext}
              onPrevious={playPrevious}
              autoPlay={autoPlay}
              onPlayStateChange={onPlayStateChange}
              onSongChange={(index) => {
                setCurrentSongIndex(index);
                onSongChange?.(index);
              }}
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