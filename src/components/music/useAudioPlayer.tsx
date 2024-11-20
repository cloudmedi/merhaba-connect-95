import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  file_url: string;
}

export function useAudioPlayer(songs: Song[] | undefined, currentSongIndex: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number>();
  const { toast } = useToast();

  useEffect(() => {
    if (!songs?.[currentSongIndex]) return;

    const audio = new Audio();
    
    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to load audio file",
        variant: "destructive",
      });
    };

    const handleLoadedMetadata = () => {
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Failed to play audio",
            variant: "destructive",
          });
        });
      }
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Set the source after adding event listeners
    audio.src = songs[currentSongIndex].file_url;
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
      audio.src = '';
      audio.remove();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [songs, currentSongIndex, toast]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Failed to play audio",
            variant: "destructive",
          });
        });
      }

      progressInterval.current = window.setInterval(() => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      }, 100);
    } else {
      audioRef.current.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, toast]);

  return {
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    audioRef
  };
}