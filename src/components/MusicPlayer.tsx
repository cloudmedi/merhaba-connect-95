import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { PlayerControls } from "./music/PlayerControls";
import { VolumeControl } from "./music/VolumeControl";
import { TrackInfo } from "./music/TrackInfo";
import { ProgressBar } from "./music/ProgressBar";

interface MusicPlayerProps {
  playlist: {
    id?: string;
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
  const [progress, setProgress] = useState(0);
  const [audio] = useState(new Audio());

  // Playlist ve şarkı yükleme
  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) {
      toast.error("No songs available in this playlist");
      onClose();
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

  // Ses kontrolü
  useEffect(() => {
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Şarkı ID değişimi kontrolü
  useEffect(() => {
    if (currentSongId && playlist.songs) {
      const index = playlist.songs.findIndex(song => song.id === currentSongId);
      if (index !== -1) {
        setCurrentSongIndex(index);
      }
    }
  }, [currentSongId, playlist.songs]);

  // Play/Pause kontrolü
  useEffect(() => {
    console.log('MusicPlayer - Play state effect:', { isPlaying });
    
    const updatePlayState = async () => {
      try {
        if (isPlaying) {
          await audio.play();
        } else {
          audio.pause();
        }
        onPlayStateChange?.(isPlaying);
      } catch (error) {
        console.error('Error updating play state:', error);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      }
    };

    updatePlayState();
  }, [isPlaying]);

  const handlePlayPause = () => {
    console.log('MusicPlayer - handlePlayPause triggered');
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
    setVolume(isMuted ? 75 : 0);
  };

  const getAudioUrl = (song: any) => {
    if (!song.file_url) return '';
    if (song.file_url.startsWith('http')) return song.file_url;
    if (song.bunny_id) return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  if (!playlist.songs || playlist.songs.length === 0) return null;
  const currentSong = playlist.songs[currentSongIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <TrackInfo
            title={currentSong.title}
            artist={currentSong.artist}
            artwork={playlist.artwork}
          />

          <div className="flex-1 max-w-2xl space-y-2">
            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
            <ProgressBar
              progress={progress}
              onProgressChange={handleProgressChange}
            />
          </div>

          <div className="flex items-center gap-4">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
            />
            
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
    </div>
  );
}