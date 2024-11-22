import { useState, useEffect, useRef } from "react";

export function useAudioPlayer(audioUrl: string | undefined) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setError("Audio URL is missing");
      return;
    }

    console.log('Loading audio from URL:', audioUrl);
    setIsLoading(true);
    setError(null);

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleCanPlay = () => {
      console.log('Audio can play now');
      setIsLoading(false);
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch(e => {
          console.error('Error playing audio:', e);
          setError("Failed to play audio");
          setIsPlaying(false);
        });
      }
    };

    const handleLoadStart = () => {
      console.log('Audio loading started');
      setIsLoading(true);
      setError(null);
    };

    const handleError = () => {
      console.error('Audio error:', audio.error);
      setIsLoading(false);
      setError(`Failed to load audio: ${audio.error?.message || 'Unknown error'}`);
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
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

    audio.preload = 'auto';
    audio.load();

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
    };
  }, [audioUrl, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error('Error playing audio:', e);
        setError("Failed to play audio");
      });
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
    audioRef.current.volume = Math.max(0, Math.min(1, value));
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