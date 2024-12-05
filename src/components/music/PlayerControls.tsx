import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Maximize2, Minimize2, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerControlsProps {
  isPlaying: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  isMiniPlayer: boolean;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onRepeatToggle: () => void;
  onShuffleToggle: () => void;
  onPlaylistToggle: () => void;
  onMiniPlayerToggle: () => void;
}

export function PlayerControls({
  isPlaying,
  isRepeat,
  isShuffle,
  isMiniPlayer,
  onPrevious,
  onPlayPause,
  onNext,
  onRepeatToggle,
  onShuffleToggle,
  onPlaylistToggle,
  onMiniPlayerToggle,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onShuffleToggle}
          className={cn(
            "text-white/70 hover:text-white hover:bg-white/10",
            isShuffle && "text-[#9b87f5]"
          )}
        >
          <Shuffle className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrevious}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          size="icon"
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] h-10 w-10 transition-colors"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNext}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRepeatToggle}
          className={cn(
            "text-white/70 hover:text-white hover:bg-white/10",
            isRepeat && "text-[#9b87f5]"
          )}
        >
          <Repeat className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlaylistToggle}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <List className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onMiniPlayerToggle}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {isMiniPlayer ? (
            <Maximize2 className="h-5 w-5" />
          ) : (
            <Minimize2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}