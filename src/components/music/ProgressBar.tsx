import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  progress: number;
  onProgressChange: (values: number[]) => void;
}

export function ProgressBar({ progress, onProgressChange }: ProgressBarProps) {
  return (
    <div className="w-full px-2">
      <Slider
        value={[progress]}
        onValueChange={onProgressChange}
        max={100}
        step={0.1}
        className="w-full"
      />
    </div>
  );
}