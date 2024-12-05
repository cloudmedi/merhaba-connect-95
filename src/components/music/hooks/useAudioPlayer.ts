import { useState, useEffect, useRef } from 'react';
import { useAudioControls } from './useAudioControls';
import { useFadeEffect } from './useFadeEffect';

interface UseAudioPlayerProps {
  playlist: {
    songs?: Array<{
      id: string | number;
      title: string;
      artist: string;
      duration: string | number;
      file_url: string;
      bunny_id?: string;
    }>;
  };
  initialSongIndex?: number;
  autoPlay?: boolean;
  onSongChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  currentSongId?: string | number;
}

export function useAudioPlayer({
  playlist,
  initialSongIndex = 0,
  autoPlay = true,
  onSongChange,
  onPlayStateChange,
  currentSongId
}: UseAudioPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  const {
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    progress,
    setProgress,
    handlePlayStateChange,
    handleVolumeChange,
    toggleMute
  } = useAudioControls();

  const { startFade, clearFade, FADE_DURATION } = useFadeEffect();

  const getAudioUrl = (song: any) => {
    if (!song.file_url) return '';
    if (song.file_url.startsWith('http')) return song.file_url;
    if (song.bunny_id) return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  const handleFadeComplete = () => {
    if (nextAudioRef.current) {
      currentAudioRef.current = nextAudioRef.current;
      nextAudioRef.current = null;
      setCurrentSongIndex(prevIndex => 
        prevIndex === playlist.songs!.length - 1 ? 0 : prevIndex + 1
      );
      onSongChange?.(currentSongIndex);
    }
  };

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const currentSong = playlist.songs[currentSongIndex];
    const audio = new Audio(getAudioUrl(currentSong));
    currentAudioRef.current = audio;
    
    if (autoPlay) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      });
    }

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      
      // Start fade when nearing the end of the song
      if (audio.duration - audio.currentTime <= FADE_DURATION / 1000) {
        const nextIndex = currentSongIndex === playlist.songs!.length - 1 ? 0 : currentSongIndex + 1;
        const nextSong = playlist.songs![nextIndex];
        
        if (!nextAudioRef.current) {
          const nextAudio = new Audio(getAudioUrl(nextSong));
          nextAudioRef.current = nextAudio;
          startFade(currentAudioRef.current, nextAudio, volume, handleFadeComplete);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.volume = isMuted ? 0 : volume / 100;

    return () => {
      clearFade();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
      audio.src = '';
    };
  }, [playlist.songs, currentSongIndex]);

  useEffect(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    if (nextAudioRef.current) {
      nextAudioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (currentAudioRef.current) {
      if (isPlaying) {
        currentAudioRef.current.pause();
      } else {
        currentAudioRef.current.play().catch(console.error);
      }
    }
    onPlayStateChange?.(!isPlaying);
  };

  const handleNext = () => {
    if (!playlist.songs) return;
    
    clearFade();
    
    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    const nextSong = playlist.songs[nextIndex];
    const nextAudio = new Audio(getAudioUrl(nextSong));
    
    nextAudioRef.current = nextAudio;
    startFade(currentAudioRef.current, nextAudio, volume, handleFadeComplete);
  };

  const handlePrevious = () => {
    if (!playlist.songs) return;
    
    clearFade();
    if (nextAudioRef.current) {
      nextAudioRef.current.pause();
      nextAudioRef.current.src = '';
      nextAudioRef.current = null;
    }
    
    const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    onSongChange?.(prevIndex);
  };

  const handleProgressChange = (values: number[]) => {
    if (!currentAudioRef.current?.duration) return;
    const [value] = values;
    const time = (value / 100) * currentAudioRef.current.duration;
    currentAudioRef.current.currentTime = time;
    setProgress(value);
  };

  return {
    currentSongIndex,
    volume,
    isMuted,
    isPlaying,
    progress,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    getCurrentSong: () => playlist.songs?.[currentSongIndex]
  };
}