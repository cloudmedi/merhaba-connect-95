import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
}

export function AudioPlayer({ audioUrl, onNext, onPrevious, volume = 1 }: AudioPlayerProps) {
  const {
    isPlaying,
    progress,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume
  } = useAudioPlayer(audioUrl);

  useEffect(() => {
    if (error) {
      toast.error("Failed to play audio", {
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

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