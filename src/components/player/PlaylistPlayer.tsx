import { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { PlaylistItem } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface PlaylistPlayerProps {
  playlist: PlaylistItem[];
  onTrackChange?: (track: PlaylistItem) => void;
}

export function PlaylistPlayer({ playlist, onTrackChange }: PlaylistPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { isPlaying, currentTime, duration, play, pause, seek } = useAudioPlayer();
  
  const currentTrack = playlist[currentTrackIndex];
  
  useEffect(() => {
    if (currentTrack) {
      play(currentTrack.file_url);
      onTrackChange?.(currentTrack);
    }
  }, [currentTrackIndex, currentTrack]);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => 
      prev === playlist.length - 1 ? 0 : prev + 1
    );
  };
  
  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => 
      prev === 0 ? playlist.length - 1 : prev - 1
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium">{currentTrack?.title}</h3>
        <p className="text-sm text-gray-500">{currentTrack?.artist}</p>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <Button variant="ghost" size="icon" onClick={handlePrevious}>
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          size="icon" 
          onClick={() => isPlaying ? pause() : play(currentTrack.file_url)}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleNext}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-1 bg-gray-200 rounded">
        <div 
          className="h-full bg-primary rounded transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
}