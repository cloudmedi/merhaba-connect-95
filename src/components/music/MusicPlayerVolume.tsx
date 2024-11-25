import { Volume, VolumeX, X } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface MusicPlayerVolumeProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (values: number[]) => void;
  onMuteToggle: () => void;
  onClose: () => void;
}

export function MusicPlayerVolume({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  onClose
}: MusicPlayerVolumeProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10"
        onClick={onMuteToggle}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume className="h-5 w-5" />
        )}
      </Button>

      <Slider
        value={[isMuted ? 0 : volume]}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="w-28"
      />

      <Button
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}