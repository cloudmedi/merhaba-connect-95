import { useState, useEffect, useRef, useCallback } from "react";
import type { AudioPlayerState, AudioControls, PlaybackConfig } from "@/components/music/types";

export function useAudioPlayer(
  audioUrl: string | undefined,
  config: PlaybackConfig = {}
) {
  const {
    autoPlay = false,
    volume: initialVolume = 1,
    onPlayStateChange,
    onTimeUpdate,
    onEnded,
    onError,
  } = config;

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    volume: initialVolume,
    isMuted: false,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setState(prev => ({ ...prev, error: "Audio URL is missing" }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false, duration: audio.duration }));
      if (state.isPlaying) {
        audio.play().catch(console.error);
      }
    };

    const handleTimeUpdate = () => {
      setState(prev => {
        const currentTime = audio.currentTime;
        const progress = (currentTime / audio.duration) * 100;
        onTimeUpdate?.(currentTime);
        return { ...prev, currentTime, progress };
      });
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, progress: 0, currentTime: 0 }));
      onEnded?.();
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
      onPlayStateChange?.(true);
    } catch (error) {
      if (error instanceof Error) {
        setState(prev => ({ ...prev, error: error.message }));
        onError?.(error);
      }
    }
  }, [onPlayStateChange, onError]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
    onPlayStateChange?.(false);
  }, [onPlayStateChange]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setState(prev => ({ ...prev, volume }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const newMutedState = !state.isMuted;
    audioRef.current.muted = newMutedState;
    setState(prev => ({ ...prev, isMuted: newMutedState }));
  }, [state.isMuted]);

  return {
    ...state,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    onEnded
  };
}