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
  const handleVolumeChange = (values: number[]) => {
    // Extract the first value from the array since we only need one value
    const [value] = values;
    onVolumeChange(values);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        onClick={onMuteToggle}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      <div className="group relative w-[100px]">
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="relative"
        >
          <div className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-white/10">
            <div 
              className="absolute h-full bg-gradient-to-r from-white/60 to-white/80 group-hover:from-white/70 group-hover:to-white/90 transition-all duration-300"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            />
          </div>
          <div 
            className="opacity-0 group-hover:opacity-100 absolute h-[10px] w-[10px] rounded-full border border-white/50 bg-white shadow-sm transition-all duration-200 hover:scale-110"
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