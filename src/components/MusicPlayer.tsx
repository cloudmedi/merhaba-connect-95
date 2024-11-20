import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X } from "lucide-react";
import { PlayerControls } from "./music/PlayerControls";
import { VolumeControl } from "./music/VolumeControl";
import { TrackInfo } from "./music/TrackInfo";
import { ProgressBar } from "./music/ProgressBar";
import { useToast } from "@/hooks/use-toast";

interface MusicPlayerProps {
  playlist: {
    title: string;
    artwork: string;
    songs?: Array<{
      id: number;
      title: string;
      artist: string;
      duration: string;
      file_url: string;
    }>;
  };
  onClose: () => void;
}

export function MusicPlayer({ playlist, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState([75]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number>();
  const { toast } = useToast();

  // Initialize audio when component mounts or playlist changes
  useEffect(() => {
    if (playlist?.songs?.[currentSongIndex]) {
      const audio = new Audio();
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Error",
          description: "Failed to load audio file",
          variant: "destructive",
        });
      });

      audio.addEventListener('loadedmetadata', () => {
        audio.volume = volume[0] / 100;
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing audio:", error);
              toast({
                title: "Playback Error",
                description: "Failed to play audio",
                variant: "destructive",
              });
            });
          }
        }
      });

      audio.src = playlist.songs[currentSongIndex].file_url;
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
        audio.remove();
      };
    }
  }, [playlist?.songs, currentSongIndex]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  // Handle play/pause
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
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);

          if (audioRef.current.ended) {
            handleNext();
          }
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
  }, [isPlaying]);

  const handleNext = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      setCurrentSongIndex((prev) => 
        prev === playlist.songs!.length - 1 ? 0 : prev + 1
      );
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      setCurrentSongIndex((prev) => 
        prev === 0 ? playlist.songs!.length - 1 : prev - 1
      );
      setProgress(0);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume([0]);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
    if (value[0] > 0) {
      setPreviousVolume(value);
    }
  };

  const currentSong = playlist.songs?.[currentSongIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="flex flex-col max-w-screen-2xl mx-auto space-y-2">
        <ProgressBar progress={progress} onProgressChange={handleProgressChange} />
        
        <div className="flex items-center justify-between">
          <TrackInfo
            artwork={playlist.artwork}
            title={currentSong?.title || playlist.title}
            artist={currentSong?.artist || "Unknown Artist"}
          />
          
          <PlayerControls
            isPlaying={isPlaying}
            onPrevious={handlePrevious}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={handleNext}
          />

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeToggle={handleVolumeToggle}
            onVolumeChange={handleVolumeChange}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}