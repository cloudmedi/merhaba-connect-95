import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  onProgressChange: (values: number[]) => void;
}

export function ProgressBar({ progress, onProgressChange }: ProgressBarProps) {
  return (
    <SliderPrimitive.Root
      className="relative flex w-full touch-none select-none items-center group"
      defaultValue={[0]}
      value={[progress]}
      onValueChange={onProgressChange}
      max={100}
      step={0.1}
      aria-label="Progress"
    >
      <SliderPrimitive.Track 
        className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-white/5"
      >
        <SliderPrimitive.Range 
          className="absolute h-full bg-gradient-to-r from-white/40 to-white/60 group-hover:from-white/60 group-hover:to-white/80 transition-all duration-300" 
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="opacity-0 group-hover:opacity-100 h-[14px] w-[14px] rounded-full border border-white/40 bg-white shadow-sm ring-offset-background transition-all duration-200 hover:h-[16px] hover:w-[16px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  );
}