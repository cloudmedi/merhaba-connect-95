import { useState } from "react";
import { useAudioPlayer } from "./music/useAudioPlayer";
import { PlayerControls } from "./music/PlayerControls";
import { VolumeControl } from "./music/VolumeControl";
import { TrackInfo } from "./music/TrackInfo";
import { ProgressBar } from "./music/ProgressBar";
import { Loader2 } from "lucide-react";

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
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState([75]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  const {
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    audioRef,
    isLoading
  } = useAudioPlayer(playlist.songs, currentSongIndex);

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
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? previousVolume[0] / 100 : 0;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
    if (value[0] > 0) {
      setPreviousVolume(value);
    }
    
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
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
          
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <PlayerControls
                isPlaying={isPlaying}
                onPrevious={handlePrevious}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
              />
            )}
          </div>

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