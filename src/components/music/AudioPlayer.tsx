import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, memo } from "react";

interface AudioPlayerProps {
  audioUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

function AudioPlayerComponent({ 
  audioUrl, 
  onNext, 
  onPrevious, 
  volume = 1,
  autoPlay = false,
  onPlayStateChange
}: AudioPlayerProps) {
  const {
    isPlaying,
    progress,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume,
    play,
    onEnded
  } = useAudioPlayer(audioUrl);

  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

  useEffect(() => {
    if (autoPlay) {
      play();
    }
  }, [autoPlay, audioUrl, play]);

  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // Handle song ending
  useEffect(() => {
    if (onNext) {
      onEnded(onNext);
    }
  }, [onNext, onEnded]);

  if (error) {
    return (
      <Alert variant="destructive" className="my-2">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full opacity-100 transition-opacity duration-200">
        <ProgressBar 
          progress={progress} 
          onProgressChange={(values) => seek(values[0])} 
        />
      </div>
      <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <PlayerControls
          isPlaying={isPlaying}
          onPrevious={onPrevious}
          onPlayPause={togglePlay}
          onNext={onNext}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const AudioPlayer = memo(AudioPlayerComponent);