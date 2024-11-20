import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from "lucide-react";

interface MusicPlayerProps {
  playlist: {
    title: string;
    artwork: string;
    songs?: Array<{
      id: number;
      title: string;
      artist: string;
      duration: string;
    }>;
  };
  onClose: () => void;
}

export function MusicPlayer({ playlist, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number>();

  useEffect(() => {
    if (playlist?.title) {
      setIsPlaying(true);
    }
  }, [playlist?.title]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.05;
        });
      }, 50);
    } else {
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
    setProgress(value[0]);
  };

  const currentSong = playlist.songs?.[currentSongIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="flex flex-col max-w-screen-2xl mx-auto space-y-2">
        <Slider
          value={[progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={0.1}
          className="h-0.5 cursor-pointer"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={playlist.artwork}
              alt={playlist.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="font-medium text-black">
                {currentSong?.title || playlist.title}
              </p>
              <p className="text-sm text-gray-500">
                {currentSong?.artist || "Now Playing"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              size="icon"
              className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-32"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}