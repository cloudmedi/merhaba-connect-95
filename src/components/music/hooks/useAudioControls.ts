import { useState, useCallback } from 'react';

export function useAudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(100);
    }
  }, [isMuted]);

  return {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    progress,
    setProgress,
    handlePlayStateChange,
    handleVolumeChange,
    toggleMute,
  };
}