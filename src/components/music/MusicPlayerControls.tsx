import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface MusicPlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function MusicPlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext
}: MusicPlayerControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {onPrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {onNext && (
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}