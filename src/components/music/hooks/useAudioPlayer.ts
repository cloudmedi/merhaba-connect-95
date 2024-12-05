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
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    console.log('Cleaning up audio resources');
    clearFade();
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    
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

  const preloadNextTrack = () => {
    if (!playlist.songs || playlist.songs.length <= 1) return;
    
    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    const nextSong = playlist.songs[nextIndex];
    
    if (nextSong) {
      console.log('Preloading next track:', nextSong.title);
      if (!nextAudioRef.current) {
        nextAudioRef.current = new Audio();
      }
      nextAudioRef.current.src = getAudioUrl(nextSong);
      nextAudioRef.current.load();
    }
  };

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const currentSong = playlist.songs[currentSongIndex];
    console.log('Setting up audio for:', currentSong.title);
    
    const audio = new Audio(getAudioUrl(currentSong));
    audioRef.current = audio;

    audio.volume = isMuted ? 0 : volume / 100;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);

      // Start transition when near the end of the track (5 seconds before end)
      const timeRemaining = audio.duration - audio.currentTime;
      if (timeRemaining <= 5 && !isTransitioning.current && isPlaying) {
        console.log('Starting transition, time remaining:', timeRemaining);
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded for:', currentSong.title);
      preloadNextTrack();
    });

    audio.addEventListener('ended', () => {
      console.log('Audio ended naturally:', currentSong.title);
      if (!isTransitioning.current) {
        handleNext();
      }
    });

    if (autoPlay || isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            console.log('Started playing:', currentSong.title);
            setIsPlaying(true);
            onPlayStateChange?.(true);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            onPlayStateChange?.(false);
          });
      }
    }

    return () => {
      console.log('Cleaning up current audio:', currentSong.title);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      cleanupAudio();
    };
  }, [playlist.songs, currentSongIndex, volume, isMuted]);

  const handleNext = () => {
    if (!playlist.songs || isTransitioning.current) {
      console.log('Skipping transition - already in progress or no songs');
      return;
    }

    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    const nextSong = playlist.songs[nextIndex];

    if (!nextSong) return;

    isTransitioning.current = true;
    console.log('Starting transition to next track:', nextSong.title);

    // Use pre-loaded audio if available, otherwise create new
    const nextAudio = nextAudioRef.current || new Audio(getAudioUrl(nextSong));
    nextAudio.volume = 0; // Start with volume at 0 for fade in
    
    const startTransition = () => {
      startFade(
        audioRef.current,
        nextAudio,
        volume,
        () => {
          console.log('Fade transition completed');
          audioRef.current = nextAudio;
          nextAudioRef.current = null;
          isTransitioning.current = false;
          setCurrentSongIndex(nextIndex);
          onSongChange?.(nextIndex);
          preloadNextTrack();
        }
      );
    };

    // Ensure next audio is ready before starting transition
    if (nextAudio.readyState >= 2) {
      startTransition();
    } else {
      console.log('Waiting for next audio to be ready...');
      nextAudio.addEventListener('canplay', startTransition, { once: true });
    }
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
    handlePlayStateChange,
    handleNext,
    handlePrevious,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    getCurrentSong: () => playlist.songs?.[currentSongIndex]
  };
}