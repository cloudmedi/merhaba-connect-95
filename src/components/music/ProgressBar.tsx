import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  onProgressChange: (value: number[]) => void;
  duration: number;
  currentTime: number;
}

export function ProgressBar({ progress, onProgressChange, duration, currentTime }: ProgressBarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const time = position * duration;
    
    setHoverPosition(position * 100);
    setHoverTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTimeFormatted = formatTime(currentTime);
  const durationFormatted = formatTime(duration);

  return (
    <div 
      className="relative w-full group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      role="group"
      aria-label="Progress bar"
    >
      <Slider
        value={[progress]}
        onValueChange={onProgressChange}
        max={100}
        step={0.1}
        className="w-full cursor-pointer"
        aria-label="Track progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${currentTimeFormatted} of ${durationFormatted}`}
      />
      
      {isHovering && (
        <div 
          className={cn(
            "absolute -top-8 transform -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs text-white",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}
          style={{ left: `${hoverPosition}%` }}
          role="tooltip"
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
}