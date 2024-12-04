import { useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface PlayerControlsProps {
  audioUrl: string;
  onNext: () => void;
  onPrevious: () => void;
  onPlayStateChange: (playing: boolean) => void;
  autoPlay?: boolean;
  isPlaying?: boolean;
}

export function PlayerControls({
  audioUrl,
  onNext,
  onPrevious,
  onPlayStateChange,
  autoPlay = true,
  isPlaying = false,
}: PlayerControlsProps) {
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 75 : 0);
  };

  return (
    <div className="flex items-center gap-4">
      <AudioPlayer
        audioUrl={audioUrl}
        onNext={onNext}
        onPrevious={onPrevious}
        volume={isMuted ? 0 : volume / 100}
        autoPlay={autoPlay}
        onPlayStateChange={onPlayStateChange}
      />
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="w-24"
        />
      </div>
    </div>
  );
}