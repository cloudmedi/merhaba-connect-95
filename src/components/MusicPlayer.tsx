import { useState, useEffect } from "react";
import { X } from "lucide-react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { toast } from "sonner";
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
    }>;
  };
  onClose: () => void;
  initialSongIndex?: number;
}

export function MusicPlayer({ playlist, onClose, initialSongIndex = 0 }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  
  useEffect(() => {
    setCurrentSongIndex(initialSongIndex);
  }, [initialSongIndex]);

  if (!playlist.songs || playlist.songs.length === 0) {
    toast.error("No songs available in this playlist");
    onClose();
    return null;
  }

  const currentSong = playlist.songs[currentSongIndex];

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
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C]/95 backdrop-blur-lg border-t border-gray-800 p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          <img 
            src={playlist.artwork} 
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
            src={currentSong?.file_url}
            showSkipControls
            showJumpControls={false}
            onClickNext={handleNext}
            onClickPrevious={handlePrevious}
            onEnded={handleNext}
            autoPlayAfterSrcChange={true}
            layout="horizontal"
            customControlsSection={[
              "MAIN_CONTROLS",
              "VOLUME_CONTROLS",
            ]}
            customProgressBarSection={[
              "PROGRESS_BAR",
              "CURRENT_TIME",
              "DURATION",
            ]}
            className="player-override"
            style={{
              background: 'transparent',
              boxShadow: 'none',
            }}
          />
        </div>

        <div className="flex items-center justify-end flex-1">
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