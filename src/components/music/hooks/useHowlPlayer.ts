import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { toast } from "sonner";

interface Song {
  id: string | number;
  title: string;
  artist: string;
  duration: string | number;
  file_url: string;
}

interface UseHowlPlayerProps {
  playlist: {
    songs?: Song[];
  };
  initialSongIndex?: number;
  autoPlay?: boolean;
  onSongChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function useHowlPlayer({
  playlist,
  initialSongIndex = 0,
  autoPlay = false,
  onSongChange,
  onPlayStateChange,
}: UseHowlPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentHowl = useRef<Howl | null>(null);
  const nextHowl = useRef<Howl | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const cleanupHowls = () => {
    if (currentHowl.current) {
      currentHowl.current.unload();
      currentHowl.current = null;
    }
    if (nextHowl.current) {
      nextHowl.current.unload();
      nextHowl.current = null;
    }
  };

  const createHowl = (song: Song) => {
    console.log('Creating Howl for song:', song.title);
    return new Howl({
      src: [song.file_url],
      html5: true,
      volume: volume / 100,
      onend: () => {
        console.log('Song ended naturally:', song.title);
        handleNext();
      },
      onloaderror: () => {
        console.error('Error loading audio:', song.title);
        toast.error(`Failed to load song: ${song.title}`);
        handleNext();
      },
      onplayerror: () => {
        console.error('Error playing audio:', song.title);
        toast.error(`Failed to play song: ${song.title}`);
        handleNext();
      }
    });
  };

  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      if (currentHowl.current && isPlaying) {
        const seek = currentHowl.current.seek() || 0;
        const duration = currentHowl.current.duration() || 1;
        setProgress((seek / duration) * 100);
      }
    }, 1000);
  };

  const handlePlayStateChange = (playing: boolean) => {
    console.log('Play state changing to:', playing);
    if (!currentHowl.current || !playlist.songs) return;

    if (playing) {
      currentHowl.current.play();
      startProgressTracking();
    } else {
      currentHowl.current.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  };

  const handleNext = () => {
    if (!playlist.songs || playlist.songs.length === 0) return;
    
    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    console.log('Moving to next song, index:', nextIndex);
    
    cleanupHowls();
    setCurrentSongIndex(nextIndex);
    onSongChange?.(nextIndex);
  };

  const handlePrevious = () => {
    if (!playlist.songs || playlist.songs.length === 0) return;
    
    const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
    console.log('Moving to previous song, index:', prevIndex);
    
    cleanupHowls();
    setCurrentSongIndex(prevIndex);
    onSongChange?.(prevIndex);
  };

  const handleProgressChange = (values: number[]) => {
    if (!currentHowl.current) return;
    const [value] = values;
    const duration = currentHowl.current.duration();
    const time = (value / 100) * duration;
    currentHowl.current.seek(time);
    setProgress(value);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (currentHowl.current) {
      currentHowl.current.volume(newVolume / 100);
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (currentHowl.current) {
      if (isMuted) {
        currentHowl.current.volume(volume / 100);
        setIsMuted(false);
      } else {
        currentHowl.current.volume(0);
        setIsMuted(true);
      }
    }
  };

  // Initialize or change current song
  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const currentSong = playlist.songs[currentSongIndex];
    console.log('Initializing song:', currentSong.title);

    cleanupHowls();
    currentHowl.current = createHowl(currentSong);

    if (autoPlay || isPlaying) {
      currentHowl.current.play();
      startProgressTracking();
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }

    return () => {
      console.log('Cleaning up audio resources');
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      cleanupHowls();
    };
  }, [playlist.songs, currentSongIndex]);

  // Handle volume changes
  useEffect(() => {
    if (currentHowl.current) {
      currentHowl.current.volume(isMuted ? 0 : volume / 100);
    }
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
    getCurrentSong: () => playlist.songs?.[currentSongIndex]
  };
}