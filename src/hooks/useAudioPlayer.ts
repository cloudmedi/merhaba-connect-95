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
    audio.preload = "metadata";
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      setError(null);
      if (isPlaying) {
        audio.play().catch(handlePlayError);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      const errorMessage = "Ses dosyası yüklenemedi. Lütfen başka bir format veya tarayıcı deneyin.";
      setError(errorMessage);
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      });
      setIsPlaying(false);
    };

    const handlePlayError = (error: Error) => {
      console.error("Oynatma hatası:", error);
      setError("Ses oynatılamıyor. Lütfen tekrar deneyin.");
      setIsPlaying(false);
      toast({
        title: "Oynatma Hatası",
        description: "Ses oynatılamıyor. Lütfen tekrar deneyin.",
        variant: "destructive"
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
      setIsPlaying(false);
      setProgress(0);
      setError(null);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [audioUrl, toast]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Oynatma hatası:", error);
      setError("Ses oynatılamıyor. Lütfen tekrar deneyin.");
      setIsPlaying(false);
    }
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