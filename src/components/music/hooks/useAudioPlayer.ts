import { useState, useEffect } from 'react';
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
  const [audio] = useState(new Audio());

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) {
      toast.error("No songs available in this playlist");
      return;
    }

    const currentSong = playlist.songs[currentSongIndex];
    audio.src = getAudioUrl(currentSong);
    
    if (autoPlay) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      });
    }

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [playlist.songs, currentSongIndex]);

  useEffect(() => {
    audio.volume = isMuted ? 0 : volume / 100;
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
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      });
    } else {
      audio.pause();
    }
    onPlayStateChange?.(isPlaying);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!playlist.songs) return;
    const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIndex);
    onSongChange?.(nextIndex);
  };

  const handlePrevious = () => {
    if (!playlist.songs) return;
    const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    onSongChange?.(prevIndex);
  };

  const handleProgressChange = (values: number[]) => {
    const [value] = values;
    const time = (value / 100) * audio.duration;
    audio.currentTime = time;
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

  const getAudioUrl = (song: any) => {
    if (!song.file_url) return '';
    if (song.file_url.startsWith('http')) return song.file_url;
    if (song.bunny_id) return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
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