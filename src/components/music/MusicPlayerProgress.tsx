import { Slider } from "../ui/slider";

interface MusicPlayerProgressProps {
  progress: number;
  onProgressChange: (values: number[]) => void;
}

export function MusicPlayerProgress({ progress, onProgressChange }: MusicPlayerProgressProps) {
  return (
    <Slider
      value={[progress]}
      onValueChange={onProgressChange}
      max={100}
      step={0.1}
      className="w-full"
    />
  );
}