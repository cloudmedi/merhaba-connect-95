import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Loader2 } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";

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
    togglePlay,
    seek,
    setVolume
  } = useAudioPlayer(audioUrl);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ProgressBar progress={progress} onProgressChange={seek} />
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
          onVolumeChange={(value) => setVolume(value[0])}
        />
      </div>
    </div>
  );
}