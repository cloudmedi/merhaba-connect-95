import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export function useAudioPlayer(audioUrl: string | undefined) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number>();

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio();
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Playback error:", error);
          setError("Playback failed");
          setIsPlaying(false);
        });
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Failed to load audio");
      toast({
        title: "Error",
        description: "Failed to load audio. Please try another format or browser.",
        variant: "destructive"
      });
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    audio.src = audioUrl;
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, toast]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback error:", error);
          setError("Playback failed");
          setIsPlaying(false);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (value: number) => {
    if (!audioRef.current) return;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value / 100;
  };

  return {
    isPlaying,
    progress,
    duration,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume
  };
}