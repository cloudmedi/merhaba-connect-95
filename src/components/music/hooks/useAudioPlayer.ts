import { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";

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
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);
  const FADE_DURATION = 3000; // 3 seconds fade duration

  const getAudioUrl = (song: any) => {
    if (!song.file_url) return '';
    if (song.file_url.startsWith('http')) return song.file_url;
    if (song.bunny_id) return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  const startFade = (nextIndex: number) => {
    if (!playlist.songs) return;
    
    const nextSong = playlist.songs[nextIndex];
    if (!nextSong) return;

    // Create and prepare the next audio element
    const nextAudio = new Audio(getAudioUrl(nextSong));
    nextAudioRef.current = nextAudio;
    nextAudio.volume = 0;
    
    // Start playing the next song
    nextAudio.play().catch(console.error);

    let progress = 0;
    const step = 20; // Update every 20ms
    const volumeStep = step / FADE_DURATION;

    fadeInterval.current = setInterval(() => {
      progress += step;
      
      if (currentAudioRef.current) {
        currentAudioRef.current.volume = Math.max(0, 1 - (progress / FADE_DURATION));
      }
      
      nextAudio.volume = Math.min(1, progress / FADE_DURATION) * (volume / 100);

      if (progress >= FADE_DURATION) {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current.src = '';
        }
        currentAudioRef.current = nextAudio;
        nextAudioRef.current = null;
        setCurrentSongIndex(nextIndex);
        onSongChange?.(nextIndex);
      }
    }, step);
  };

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) {
      toast.error("No songs available in this playlist");
      return;
    }

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
        if (!fadeInterval.current) {
          startFade(nextIndex);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.volume = isMuted ? 0 : volume / 100;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      audio.pause();
      audio.src = '';
    };
  }, [playlist.songs, currentSongIndex]);

  useEffect(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (currentSongId && playlist.songs) {
      const index = playlist.songs.findIndex(song => song.id === currentSongId);
      if (index !== -1) {
        setCurrentSongIndex(index);
      }
    }
  }, [currentSongId, playlist.songs]);

  useEffect(() => {
    if (isPlaying) {
      currentAudioRef.current?.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      });
    } else {
      currentAudioRef.current?.pause();
    }
    onPlayStateChange?.(isPlaying);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!playlist.songs) return;
    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    
    // Clear any existing fade
    if (fadeInterval.current) {
      clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    // Start new fade
    startFade(nextIndex);
  };

  const handlePrevious = () => {
    if (!playlist.songs) return;
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

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(100);
    }
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