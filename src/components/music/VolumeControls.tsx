import { memo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface VolumeControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (values: number[]) => void;
  onMuteToggle: () => void;
}

export const VolumeControls = memo(function VolumeControls({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle
}: VolumeControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10"
        onClick={onMuteToggle}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      <Slider
        value={[isMuted ? 0 : volume]}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="w-24"
      />
    </div>
  );
});