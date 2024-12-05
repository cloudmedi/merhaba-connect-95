import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function PlayerControls({ isPlaying, onPlayPause, onNext, onPrevious }: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      
      <Button
        size="icon"
        onClick={onPlayPause}
        className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full transition-all"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
}