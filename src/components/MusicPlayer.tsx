import { useState, useEffect } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { AudioPlayer } from "./music/AudioPlayer";
import { toast } from "sonner";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

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
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    setIsMuted(values[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 75 : 0);
  };

  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=400&quality=85&format=webp`;
  };

  const getAudioUrl = (song: any) => {
    if (!song.file_url) {
      console.error('No file_url provided for song:', song);
      return '';
    }
    
    if (song.file_url.startsWith('http')) {
      return song.file_url;
    }
    
    if (song.bunny_id) {
      return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    }
    
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C]/95 backdrop-blur-lg border-t border-gray-800 p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          <img 
            src={getOptimizedImageUrl(playlist.artwork)} 
            alt={currentSong?.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-white font-medium">{currentSong?.title}</h3>
            <p className="text-gray-400 text-sm">{currentSong?.artist}</p>
          </div>
        </div>

        <div className="flex-1">
          <AudioPlayer
            key={currentSong?.id} // Add key to force re-render on song change
            audioUrl={getAudioUrl(currentSong)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            volume={isMuted ? 0 : volume / 100}
            autoPlay={autoPlay}
            onPlayStateChange={handlePlayPause}
          />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
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
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}