import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AudioPreviewProps {
  fileUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
}

export function AudioPreview({ fileUrl, onPlay, onPause }: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onPause?.();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={fileUrl}
        onEnded={handleEnded}
        preload="none"
      />
      <Button
        size="icon"
        variant="ghost"
        className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white" />
        )}
      </Button>
    </>
  );
}