import { useState, useEffect, useCallback } from 'react';
import { useAudioContext } from './useAudioContext';
import { useAudioSource } from './useAudioSource';
import { toast } from "sonner";

interface UseAudioPlayerProps {
  playlist: {
    songs?: Array<{
      id: string | number;
      title: string;
      artist: string;
      duration: string | number;
      file_url: string;
    }>;
  };
  initialSongIndex?: number;
  autoPlay?: boolean;
  onSongChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function useAudioPlayer({
  playlist,
  initialSongIndex = 0,
  autoPlay = false,
  onSongChange,
  onPlayStateChange
}: UseAudioPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioContext = useAudioContext();
  const currentSong = playlist.songs?.[currentSongIndex];

  const { play, pause, setVolume: setSourceVolume, duration } = useAudioSource({
    url: currentSong?.file_url || '',
    context: audioContext,
    onEnded: () => {
      handleNext();
    }
  });

  useEffect(() => {
    if (autoPlay) {
      handlePlayStateChange(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    // Update volume when mute state changes
    setSourceVolume(isMuted ? 0 : volume / 100);
  }, [volume, isMuted]);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    console.log('Play state change:', { playing });
    
    if (playing) {
      play();
    } else {
      pause();
    }

    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  }, [play, pause, onPlayStateChange]);

  const handleNext = useCallback(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const nextIndex = (currentSongIndex + 1) % playlist.songs.length;
    console.log('Playing next song:', { currentIndex: currentSongIndex, nextIndex });
    
    setCurrentSongIndex(nextIndex);
    onSongChange?.(nextIndex);
  }, [currentSongIndex, playlist.songs, onSongChange]);

  const handlePrevious = useCallback(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
    console.log('Playing previous song:', { currentIndex: currentSongIndex, prevIndex });
    
    setCurrentSongIndex(prevIndex);
    onSongChange?.(prevIndex);
  }, [currentSongIndex, playlist.songs, onSongChange]);

  const handleProgressChange = useCallback((values: number[]) => {
    const [value] = values;
    setProgress(value);
    // Web Audio API doesn't support seeking directly, we'll need to reload the audio
    // This is a limitation of the current implementation
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (!isMuted) {
      setSourceVolume(newVolume / 100);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    setSourceVolume(isMuted ? volume / 100 : 0);
  }, [volume, isMuted]);

  return {
    currentSongIndex,
    volume,
    isMuted,
    isPlaying,
    progress,
    handlePlayStateChange,
    handleNext,
    handlePrevious,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    getCurrentSong: () => currentSong
  };
}