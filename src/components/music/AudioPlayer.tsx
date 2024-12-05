import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, memo } from "react";

interface AudioPlayerProps {
  audioUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  repeat?: boolean;
}

function AudioPlayerComponent({
  audioUrl,
  onNext,
  onPrevious,
  volume = 1,
  autoPlay = false,
  onPlayStateChange,
  onTimeUpdate,
  repeat = false,
}: AudioPlayerProps) {
  const {
    isPlaying,
    progress,
    currentTime,
    duration,
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

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(currentTime, duration);
    }
  }, [currentTime, duration, onTimeUpdate]);

  useEffect(() => {
    if (onNext) {
      onEnded(() => {
        if (repeat) {
          play();
        } else {
          onNext();
        }
      });
    }
  }, [onNext, onEnded, repeat, play]);

  if (error) {
    return (
      <Alert variant="destructive" className="my-2">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-transparent">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return null;
}

export const AudioPlayer = memo(AudioPlayerComponent);