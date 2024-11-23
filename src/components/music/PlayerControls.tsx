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
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onPrevious}
        className="text-gray-400 hover:text-[#9b87f5] hover:bg-[#1A1F2C] transition-colors"
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] h-8 w-8 transition-colors"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onNext}
        className="text-gray-400 hover:text-[#9b87f5] hover:bg-[#1A1F2C] transition-colors"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
}