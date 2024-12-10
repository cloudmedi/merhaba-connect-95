import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({
  audioUrl,
  onNext,
  onPrevious,
  autoPlay = false,
  onPlayStateChange
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      if (onNext) {
        onNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    audio.src = audioUrl;
    if (autoPlay) {
      audio.play().catch(console.error);
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, autoPlay, onNext, onPlayStateChange]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    
    setIsPlaying(!isPlaying);
    onPlayStateChange?.(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = (x / width) * 100;
    const time = (percentage / 100) * audioRef.current.duration;

    audioRef.current.currentTime = time;
    setProgress(percentage);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={!onPrevious}
          className="text-white hover:text-white/80"
        >
          <SkipBack className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="text-white hover:text-white/80"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!onNext}
          className="text-white hover:text-white/80"
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      <div
        className="relative w-full h-2 bg-gray-700 rounded cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="absolute h-full bg-white rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}