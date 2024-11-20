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

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      setError(null);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Ses dosyası yüklenemedi");
      setIsPlaying(false);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ses dosyası yüklenemedi",
      });
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      setIsPlaying(false);
      setProgress(0);
      setError(null);
    };
  }, [audioUrl, toast]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (value: number) => {
    if (!audioRef.current || !duration) return;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;
    const volume = Math.max(0, Math.min(1, value / 100));
    audioRef.current.volume = volume;
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