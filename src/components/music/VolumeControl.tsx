import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        onClick={onMuteToggle}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      <div className="group relative w-24">
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={onVolumeChange}
          max={100}
          step={1}
          className="relative"
        >
          <div className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-white/5">
            <div 
              className="absolute h-full bg-gradient-to-r from-white/40 to-white/60 group-hover:from-white/60 group-hover:to-white/80 transition-all duration-300"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            />
          </div>
          <div 
            className="opacity-0 group-hover:opacity-100 absolute h-[10px] w-[10px] rounded-full border border-white/40 bg-white shadow-sm transition-all duration-200 hover:h-[12px] hover:w-[12px]"
            style={{ 
              left: `calc(${isMuted ? 0 : volume}% - 5px)`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </Slider>
      </div>
    </div>
  );
}