import { useState, useEffect } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { AudioPlayer } from "./music/AudioPlayer";
import { toast } from "sonner";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { PlayerControls } from "./music/PlayerControls";
import { PlayerProgress } from "./music/PlayerProgress";
import { TrackInfo } from "./music/TrackInfo";

interface MusicPlayerProps {
  playlist: {
    title: string;
    artwork: string;
    songs?: Array<{
      id: string | number;
      title: string;
      artist: string;
      duration: string | number;
      file_url: string;
      bunny_id?: string;
    }>;
  };
  onClose: () => void;
  initialSongIndex?: number;
  autoPlay?: boolean;
  onSongChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  currentSongId?: string | number;
}

export function MusicPlayer({
  playlist,
  onClose,
  initialSongIndex = 0,
  autoPlay = true,
  onSongChange,
  onPlayStateChange,
  currentSongId
}: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  
  useEffect(() => {
    if (currentSongId && playlist.songs) {
      const index = playlist.songs.findIndex(song => song.id === currentSongId);
      if (index !== -1) {
        setCurrentSongIndex(index);
      }
    }
  }, [currentSongId, playlist.songs]);

  useEffect(() => {
    setCurrentSongIndex(initialSongIndex);
  }, [initialSongIndex]);

  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  if (!playlist.songs || playlist.songs.length === 0) {
    toast.error("No songs available in this playlist");
    onClose();
    return null;
  }

  const currentSong = playlist.songs[currentSongIndex];

  const handleNext = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const nextIndex = currentSongIndex === playlist.songs.length - 1 ? 0 : currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      onSongChange?.(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const prevIndex = currentSongIndex === 0 ? playlist.songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      onSongChange?.(prevIndex);
    }
  };

  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 75 : 0);
  };

  const handleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up">
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-black/90 backdrop-blur-lg" />
      
      <div className="relative px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex-1 min-w-[180px] max-w-[300px]">
          <TrackInfo
            artwork={currentSong.artwork_url || playlist.artwork}
            title={currentSong.title}
            artist={currentSong.artist}
          />
        </div>

        <div className="flex-1 max-w-2xl px-4 flex flex-col items-center gap-2">
          <PlayerControls
            isPlaying={isPlaying}
            onPrevious={handlePrevious}
            onPlayPause={() => handlePlayPause(!isPlaying)}
            onNext={handleNext}
            onShuffle={handleShuffle}
            onRepeat={handleRepeat}
            isShuffled={isShuffled}
            repeatMode={repeatMode}
          />
          
          <PlayerProgress
            progress={(currentTime / duration) * 100}
            duration={duration}
            currentTime={currentTime}
            onProgressChange={(values) => {
              const time = (values[0] / 100) * duration;
              setCurrentTime(time);
            }}
          />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end min-w-[180px]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}