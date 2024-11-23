import { useState, useEffect, useRef, useCallback } from "react";

export function useAudioPlayer(audioUrl: string | undefined) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Cleanup function for the progress interval
  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Setup progress tracking interval
  const setupProgressInterval = () => {
    clearProgressInterval();
    if (audioRef.current && isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current && audioRef.current.duration) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      }, 100);
    }
  };

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
      setIsLoading(false);
      setError(`Failed to load audio: ${audio.error?.message || 'Unknown error'}`);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    audio.src = audioUrl;
    audio.load();

    setupProgressInterval();

    return () => {
      clearProgressInterval();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      setIsPlaying(false);
      setProgress(0);
      setError(null);
    };
  }, [audioUrl, isPlaying]);

  // Update progress interval when play state changes
  useEffect(() => {
    setupProgressInterval();
    return clearProgressInterval;
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setError("Failed to play audio");
          setIsPlaying(false);
        });
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const play = useCallback(() => {
    if (!audioRef.current || isPlaying) return;
    
    const playPromise = audioRef.current.play();
    if (playPromise) {
      playPromise.catch(error => {
        console.error('Error playing audio:', error);
        setError("Failed to play audio");
        setIsPlaying(false);
      });
    }
    setIsPlaying(true);
  }, [isPlaying]);

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

  return {
    isPlaying,
    progress,
    duration,
    isLoading,
    error,
    togglePlay,
    play,
    seek,
    setVolume
  };
}