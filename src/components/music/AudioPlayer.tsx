import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AudioPlayer({ audioUrl, onNext, onPrevious }: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  
  const {
    isPlaying,
    progress,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume: setAudioVolume
  } = useAudioPlayer(audioUrl);

  useEffect(() => {
    if (error) {
      toast.error("Failed to play audio", {
        description: error,
      });
    }
  }, [error]);

  const handleVolumeChange = (values: number[]) => {
    setVolume(values);
    setAudioVolume(values[0] / 100);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume([75]);
      setAudioVolume(0.75);
    } else {
      setVolume([0]);
      setAudioVolume(0);
    }
  };

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
    <div className="space-y-2">
      <ProgressBar progress={progress} onProgressChange={(values) => seek(values[0])} />
      <div className="flex items-center justify-between">
        <PlayerControls
          isPlaying={isPlaying}
          onPrevious={onPrevious}
          onPlayPause={togglePlay}
          onNext={onNext}
        />
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeToggle={handleVolumeToggle}
          onVolumeChange={handleVolumeChange}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}