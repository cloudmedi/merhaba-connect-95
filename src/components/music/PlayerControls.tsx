import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}

export function PlayerControls({
  isPlaying,
  onPrevious,
  onPlayPause,
  onNext,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onPrevious}>
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );
}