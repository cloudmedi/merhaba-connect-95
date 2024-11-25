import { useState, useEffect } from "react";
import { AudioPlayer } from "./music/AudioPlayer";
import { toast } from "sonner";
import { MusicPlayerArtwork } from "./music/MusicPlayerArtwork";
import { MusicPlayerControls } from "./music/MusicPlayerControls";
import { MusicPlayerProgress } from "./music/MusicPlayerProgress";
import { MusicPlayerVolume } from "./music/MusicPlayerVolume";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up">
      <div className="bg-[#121212] border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <MusicPlayerArtwork
              artwork={playlist.artwork}
              title={currentSong.title}
              artist={currentSong.artist}
            />

            <div className="flex-1 flex flex-col gap-2">
              <MusicPlayerProgress
                progress={0}
                onProgressChange={() => {}}
              />

              <div className="flex justify-center">
                <MusicPlayerControls
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              </div>
            </div>

            <MusicPlayerVolume
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
              onClose={onClose}
            />
          </div>
        </div>
      </div>

      <AudioPlayer
        audioUrl={getAudioUrl(currentSong)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        volume={isMuted ? 0 : volume / 100}
        autoPlay={autoPlay}
        onPlayStateChange={handlePlayPause}
      />
    </div>
  );
}