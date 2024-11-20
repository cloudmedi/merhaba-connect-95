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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!songs?.[currentSongIndex]) return;

    // Cleanup previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.remove();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    const audio = new Audio();
    audio.preload = "auto"; // Ensure audio preloading
    
    const handleError = () => {
      console.error('Audio error:', audio.error);
      setIsPlaying(false);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load audio file. Please try again.",
        variant: "destructive",
      });
    };

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Failed to play audio. Please try again.",
            variant: "destructive",
          });
        });
      }
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    
    // Set the source after adding event listeners
    try {
      audio.src = songs[currentSongIndex].file_url;
      audioRef.current = audio;
    } catch (error) {
      console.error("Error setting audio source:", error);
      handleError();
    }

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.pause();
      audio.src = '';
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [songs, currentSongIndex, toast]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && !isLoading) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Failed to play audio. Please try again.",
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
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, isLoading, toast]);

  return {
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    audioRef,
    isLoading
  };
}