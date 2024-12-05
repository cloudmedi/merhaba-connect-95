import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  duration: number;
  currentTime: number;
  onProgressChange: (value: number[]) => void;
}

export function ProgressBar({ 
  progress, 
  duration,
  currentTime,
  onProgressChange 
}: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <Slider
        value={[progress]}
        onValueChange={onProgressChange}
        max={100}
        step={0.1}
        className="w-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-white/60">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}