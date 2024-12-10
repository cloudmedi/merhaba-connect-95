import { useState, useRef, useEffect } from "react";
import type { PreviewPlaylist } from "./types";

interface AudioPreviewProps {
  playlist: PreviewPlaylist;
  onPreviewEnd: () => void;
}

export function AudioPreview({ playlist, onPreviewEnd }: AudioPreviewProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) {
      console.warn('No songs available in playlist:', playlist.id);
      onPreviewEnd();
      return;
    }

    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = 1;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= 15 && !fadeTimeout.current) {
        startFadeOut();
      }
    };

    const handleEnded = () => {
      if (currentSongIndex < playlist.songs.length - 1) {
        setCurrentSongIndex(prev => prev + 1);
      } else {
        onPreviewEnd();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      handleEnded(); // Hata durumunda sonraki şarkıya geç
    });

    // Mevcut şarkıyı çal
    const currentSong = playlist.songs[currentSongIndex];
    if (currentSong?.file_url) {
      console.log('Playing song:', currentSong.title, 'URL:', currentSong.file_url);
      audio.src = currentSong.file_url;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        handleEnded();
      });
    } else {
      console.error('Invalid song data:', currentSong);
      handleEnded();
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
      }
      audio.pause();
      audio.src = '';
    };
  }, [playlist, currentSongIndex, onPreviewEnd]);

  const startFadeOut = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    let volume = 1;
    const fadeInterval = setInterval(() => {
      volume = Math.max(0, volume - 0.1);
      audio.volume = volume;

      if (volume <= 0) {
        clearInterval(fadeInterval);
        audio.pause();
        if (currentSongIndex < playlist.songs.length - 1) {
          setCurrentSongIndex(prev => prev + 1);
        } else {
          onPreviewEnd();
        }
      }
    }, 100);

    fadeTimeout.current = setTimeout(() => {
      clearInterval(fadeInterval);
    }, 1000);
  };

  return null;
}