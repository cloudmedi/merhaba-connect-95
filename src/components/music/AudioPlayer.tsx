import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioPlayerProps {
  audioUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AudioPlayer({ audioUrl, onNext, onPrevious }: AudioPlayerProps) {
  const {
    isPlaying,
    progress,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume
  } = useAudioPlayer(audioUrl);

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
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  const handleSeek = (values: number[]) => {
    seek(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  return (
    <div className="space-y-2">
      <ProgressBar progress={progress} onProgressChange={handleSeek} />
      <div className="flex items-center justify-between">
        <PlayerControls
          isPlaying={isPlaying}
          onPrevious={onPrevious}
          onPlayPause={togglePlay}
          onNext={onNext}
        />
        <VolumeControl
          volume={[75]}
          isMuted={false}
          onVolumeToggle={() => {}}
          onVolumeChange={handleVolumeChange}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}