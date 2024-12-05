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
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/10">
        <SliderPrimitive.Range className="absolute h-full bg-white/50 group-hover:bg-white transition-colors" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="hidden group-hover:block h-3 w-3 rounded-full border border-white/50 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  );
}