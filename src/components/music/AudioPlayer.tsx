import { useState, useEffect, useRef } from 'react';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';

interface AudioPlayerProps {
  audioUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({
  audioUrl,
  onNext,
  onPrevious,
  volume = 1,
  autoPlay = false,
  onPlayStateChange
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          onPlayStateChange?.(false);
        });
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      setProgress(0);
      onNext?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    audio.src = audioUrl;
    audio.load();
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };
  }, [audioUrl, autoPlay, onNext, volume, onPlayStateChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      });
    }
    
    setIsPlaying(!isPlaying);
    onPlayStateChange?.(!isPlaying);
  };

  const handleSeek = (values: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const [value] = values;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onNext={onNext}
        onPrevious={onPrevious}
      />
      <ProgressBar progress={progress} onProgressChange={handleSeek} />
    </div>
  );
}