import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  isShuffled?: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  className?: string;
}

export function PlayerControls({
  isPlaying,
  onPrevious,
  onPlayPause,
  onNext,
  onShuffle,
  onRepeat,
  isShuffled,
  repeatMode = 'off',
  className
}: PlayerControlsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {onShuffle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onShuffle}
          className={cn(
            "text-white/60 hover:text-white hover:bg-white/10",
            isShuffled && "text-[#9b87f5]"
          )}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        className="text-white/60 hover:text-white hover:bg-white/10"
      >
        <SkipBack className="h-5 w-5" />
      </Button>

      <Button
        size="icon"
        onClick={onPlayPause}
        className="bg-white text-black hover:bg-white/90 h-8 w-8 rounded-full"
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
        className="text-white/60 hover:text-white hover:bg-white/10"
      >
        <SkipForward className="h-5 w-5" />
      </Button>

      {onRepeat && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRepeat}
          className={cn(
            "text-white/60 hover:text-white hover:bg-white/10",
            repeatMode !== 'off' && "text-[#9b87f5]"
          )}
        >
          <Repeat className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}