import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

interface AudioPlayerProps {
  audioUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({ 
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
    play
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

  if (error) {
    return (
      <Alert variant="destructive" className="my-2">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressBar progress={progress} onProgressChange={(values) => seek(values[0])} />
      <PlayerControls
        isPlaying={isPlaying}
        onPrevious={onPrevious}
        onPlayPause={togglePlay}
        onNext={onNext}
      />
    </div>
  );
}