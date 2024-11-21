import { useState } from "react";
import { X } from "lucide-react";
import { TrackInfo } from "./music/TrackInfo";
import { AudioPlayer } from "./music/AudioPlayer";
import { toast } from "sonner";

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
    }>;
  };
  onClose: () => void;
}

export function MusicPlayer({ playlist, onClose }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const currentSong = playlist.songs?.[currentSongIndex];

  if (!playlist.songs || playlist.songs.length === 0) {
    toast.error("Bu playlist'te çalınacak şarkı bulunmuyor.");
    onClose();
    return null;
  }

  const handleNext = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      setCurrentSongIndex((prev) => 
        prev === playlist.songs!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevious = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      setCurrentSongIndex((prev) => 
        prev === 0 ? playlist.songs!.length - 1 : prev - 1
      );
    }
  };

  // Use a default placeholder image if artwork is missing or invalid
  const defaultArtwork = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
  const artworkUrl = playlist.artwork || defaultArtwork;

  // Format duration if it's a number
  const formatDuration = (duration: string | number) => {
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return duration;
  };

  // Prepare the current song with formatted duration
  const formattedCurrentSong = currentSong ? {
    ...currentSong,
    duration: formatDuration(currentSong.duration)
  } : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="flex flex-col max-w-screen-2xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <TrackInfo
            artwork={artworkUrl}
            title={currentSong?.title || playlist.title}
            artist={currentSong?.artist || "Unknown Artist"}
          />
          
          <AudioPlayer
            audioUrl={currentSong?.file_url}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}