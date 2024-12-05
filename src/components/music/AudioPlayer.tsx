import { useEffect, useCallback } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "./LoadingOverlay";
import { toast } from "sonner";

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
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    togglePlay,
    seek,
    setVolume
  } = useAudioPlayer(audioUrl, {
    autoPlay,
    volume,
    onPlayStateChange,
    onEnded: onNext
  });

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

  const handlePlayPause = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  if (error) {
    toast.error("Şarkı yüklenirken bir hata oluştu", {
      description: error,
      action: {
        label: "Tekrar Dene",
        onClick: () => play()
      }
    });
  }

  return (
    <div 
      className="relative flex flex-col items-center gap-2"
      role="region"
      aria-label="Audio player controls"
    >
      {isLoading && <LoadingOverlay />}
      
      <div 
        className="w-full flex items-center gap-4 text-sm text-white/60"
        role="timer"
        aria-label="Track progress"
      >
        <span>{formatTime(currentTime)}</span>
        <div className="flex-1">
          <ProgressBar 
            progress={progress} 
            onProgressChange={(values) => seek(values[0])}
            duration={duration}
            currentTime={currentTime}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="transition-opacity duration-200">
        <PlayerControls
          isPlaying={isPlaying}
          onPrevious={onPrevious}
          onPlayPause={handlePlayPause}
          onNext={onNext}
        />
      </div>
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}