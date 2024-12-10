import { useState, useRef, useEffect } from "react";

interface AudioPreviewProps {
  playlist: any;
  onPreviewEnd: () => void;
}

export function AudioPreview({ playlist, onPreviewEnd }: AudioPreviewProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

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

    // Start playing the current song
    audio.src = playlist.songs[currentSongIndex].file_url;
    audio.play().catch(console.error);

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
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0.1) {
        audio.volume = Math.max(0, audio.volume - 0.1);
      } else {
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

  return null; // This is an invisible component that handles audio
}