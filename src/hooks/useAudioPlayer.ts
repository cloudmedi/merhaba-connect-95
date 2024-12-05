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
  const onEndedCallbackRef = useRef<(() => void) | null>(null);

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

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    };

    const handleError = () => {
      console.error('Audio error:', audio.error);
      setState(prev => ({ ...prev, isLoading: false, error: `Şarkı yüklenemedi: ${audio.error?.message || 'Bilinmeyen hata'}` }));
      setState(prev => ({ ...prev, isPlaying: false }));
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
      onEndedCallbackRef.current?.();
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      setState(prev => ({ ...prev, isPlaying: false, progress: 0, currentTime: 0, error: null }));
      audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setState(prev => ({ ...prev, error: "Şarkı oynatılamadı" }));
          onError?.(error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  const controls: AudioControls = {
    play: async () => {
      if (!audioRef.current) return;
      try {
        await audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      } catch (error) {
        if (error instanceof Error) {
          setState(prev => ({ ...prev, error: error.message }));
          onError?.(error);
        }
      }
    },
    pause: () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    },
    seek: (time: number) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    },
    setVolume: (volume: number) => {
      if (!audioRef.current) return;
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    },
    toggleMute: () => {
      if (!audioRef.current) return;
      const newMutedState = !state.isMuted;
      audioRef.current.muted = newMutedState;
      setState(prev => ({ ...prev, isMuted: newMutedState }));
    },
  };

  return {
    ...state,
    ...controls,
  };
}
