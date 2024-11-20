import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, X } from "lucide-react";

interface VolumeControlProps {
  volume: number[];
  isMuted: boolean;
  onVolumeToggle: () => void;
  onVolumeChange: (value: number[]) => void;
  onClose: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeToggle,
  onVolumeChange,
  onClose,
}: VolumeControlProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onVolumeToggle}
          className="h-8 w-8"
        >
          {isMuted || volume[0] === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={volume}
          onValueChange={onVolumeChange}
          max={100}
          step={1}
          className="w-32"
        />
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}