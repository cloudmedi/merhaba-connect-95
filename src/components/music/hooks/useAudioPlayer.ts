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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioning = useRef(false);

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

  const { startFade, clearFade } = useFadeEffect();

  const getAudioUrl = (song: any) => {
    if (!song.file_url) return '';
    if (song.file_url.startsWith('http')) return song.file_url;
    if (song.bunny_id) return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  const cleanupAudio = () => {
    clearFade();
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
    }
    
    if (nextAudioRef.current) {
      nextAudioRef.current.pause();
      nextAudioRef.current.src = '';
      nextAudioRef.current.load();
    }

    isTransitioning.current = false;
  };

  // Pre-load next track
  const preloadNextTrack = () => {
    if (!playlist.songs || playlist.songs.length <= 1) return;
    
    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    const nextSong = playlist.songs[nextIndex];
    
    if (nextSong) {
      const audio = new Audio();
      audio.src = getAudioUrl(nextSong);
      audio.load();
      nextAudioRef.current = audio;
    }
  };

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const currentSong = playlist.songs[currentSongIndex];
    
    const audio = new Audio(getAudioUrl(currentSong));
    audioRef.current = audio;

    audio.volume = isMuted ? 0 : volume / 100;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);

      // Start transition when near the end of the track (5 seconds before end)
      const timeRemaining = audio.duration - audio.currentTime;
      if (timeRemaining <= 5 && !isTransitioning.current) {
        console.log('Starting transition, time remaining:', timeRemaining);
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', preloadNextTrack);

    if (autoPlay || isPlaying) {
      audio.play().catch(console.error);
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', preloadNextTrack);
      cleanupAudio();
    };
  }, [playlist.songs, currentSongIndex, volume, isMuted]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    
    setIsPlaying(!isPlaying);
    onPlayStateChange?.(!isPlaying);
  };

  const handleNext = () => {
    if (!playlist.songs || isTransitioning.current) return;

    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    const nextSong = playlist.songs[nextIndex];

    if (!nextSong) return;

    isTransitioning.current = true;
    console.log('Starting fade transition to next track');

    // Use pre-loaded audio if available, otherwise create new
    const nextAudio = nextAudioRef.current || new Audio(getAudioUrl(nextSong));
    
    startFade(
      audioRef.current,
      nextAudio,
      volume,
      () => {
        audioRef.current = nextAudio;
        nextAudioRef.current = null;
        isTransitioning.current = false;
        setCurrentSongIndex(nextIndex);
        onSongChange?.(nextIndex);
        preloadNextTrack(); // Pre-load the next track after transition
        console.log('Fade transition completed');
      }
    );
  };

  const handlePrevious = () => {
    if (!playlist.songs || isTransitioning.current) return;
    cleanupAudio();
    const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    onSongChange?.(prevIndex);
  };

  const handleProgressChange = (values: number[]) => {
    if (!audioRef.current?.duration) return;
    const [value] = values;
    const time = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
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