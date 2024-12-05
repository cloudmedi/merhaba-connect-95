import { X } from "lucide-react";
import { Button } from "../ui/button";
import { PlayerControls } from "./PlayerControls";
import { VolumeControl } from "./VolumeControl";
import { TrackInfo } from "./TrackInfo";
import { ProgressBar } from "./ProgressBar";
import { useAudioPlayer } from "./hooks/useAudioPlayer";

interface MusicPlayerProps {
  playlist: {
    id?: string;
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

export function MusicPlayerContainer({
  playlist,
  onClose,
  initialSongIndex = 0,
  autoPlay = true,
  onSongChange,
  onPlayStateChange,
  currentSongId
}: MusicPlayerProps) {
  const {
    currentSongIndex,
    volume,
    isMuted,
    isPlaying,
    progress,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    getCurrentSong
  } = useAudioPlayer({
    playlist,
    initialSongIndex,
    autoPlay,
    onSongChange,
    onPlayStateChange,
    currentSongId
  });

  if (!playlist.songs || playlist.songs.length === 0) return null;
  const currentSong = getCurrentSong();
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <TrackInfo
            title={currentSong.title}
            artist={currentSong.artist}
            artwork={playlist.artwork}
          />

          <div className="flex-1 max-w-2xl space-y-2">
            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
            <ProgressBar
              progress={progress}
              onProgressChange={handleProgressChange}
            />
          </div>

          <div className="flex items-center gap-4">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
            />
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}