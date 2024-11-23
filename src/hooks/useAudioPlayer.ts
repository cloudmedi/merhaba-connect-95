import { useState, useEffect, useRef, useCallback } from "react";

export function useAudioPlayer(audioUrl: string | undefined) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setError("Audio URL is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    const audio = new Audio();
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    const handleLoadStart = () => {
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
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    audio.src = audioUrl;
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
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setError("Failed to play audio");
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const seek = useCallback((value: number) => {
    if (!audioRef.current || !duration) return;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  }, [duration]);

  const setVolume = useCallback((value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.max(0, Math.min(1, value));
  }, []);

  const onEnded = useCallback((callback: () => void) => {
    onEndedCallbackRef.current = callback;
  }, []);

  return {
    isPlaying,
    progress,
    duration,
    isLoading,
    error,
    togglePlay,
    play,
    seek,
    setVolume,
    onEnded
  };
}