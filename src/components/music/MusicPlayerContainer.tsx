import { useState, useEffect, useRef } from 'react';
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { PlayerControls } from "./PlayerControls";
import { VolumeControl } from "./VolumeControl";
import { TrackInfo } from "./TrackInfo";
import { ProgressBar } from "./ProgressBar";
import { useNavigate } from "react-router-dom";

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
  isPlaying?: boolean;
}

export function MusicPlayerContainer({
  playlist,
  onClose,
  initialSongIndex = 0,
  autoPlay = true,
  onSongChange,
  onPlayStateChange,
  currentSongId,
  isPlaying: externalIsPlaying
}: MusicPlayerProps) {
  const navigate = useNavigate();
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!playlist.songs || playlist.songs.length === 0) return;

    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      onPlayStateChange?.(false);
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Set up initial audio
    const currentSong = playlist.songs[currentSongIndex];
    if (currentSong) {
      audio.src = currentSong.file_url;
      if (externalIsPlaying) {
        audio.play().catch(console.error);
      }
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [playlist.songs, currentSongIndex]);

  // Respond to external play state changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (externalIsPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [externalIsPlaying]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (externalIsPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    onPlayStateChange?.(!externalIsPlaying);
  };

  const handleNext = () => {
    if (!playlist.songs) return;
    const nextIndex = (currentSongIndex + 1) % playlist.songs.length;
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
    if (!audioRef.current) return;
    const [value] = values;
    const time = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  const handleVolumeChange = (values: number[]) => {
    if (!audioRef.current) return;
    const [value] = values;
    const volumeValue = value / 100;
    audioRef.current.volume = volumeValue;
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.volume = newMutedState ? 0 : volume;
  };

  const handleArtworkClick = () => {
    if (playlist.id) {
      navigate(`/manager/playlists/${playlist.id}`);
    }
  };

  const currentSong = playlist.songs?.[currentSongIndex];
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <TrackInfo
            title={currentSong.title}
            artist={currentSong.artist}
            artwork={playlist.artwork}
            onArtworkClick={handleArtworkClick}
          />

          <div className="flex-1 max-w-2xl space-y-2">
            <PlayerControls
              isPlaying={externalIsPlaying || false}
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
              volume={volume * 100}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
            />
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
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