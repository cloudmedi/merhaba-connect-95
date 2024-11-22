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
    toast.error("No songs available in this playlist");
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C] border-t border-gray-800 p-4 z-50">
      <div className="flex flex-col max-w-screen-2xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <TrackInfo
            artwork={playlist.artwork}
            title={currentSong?.title || playlist.title}
            artist={currentSong?.artist || "Unknown Artist"}
          />
          
          <AudioPlayer
            audioUrl={currentSong?.file_url}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}