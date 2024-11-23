import { Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Song {
  id: string | number;
  title: string;
  artist: string;
  duration: string | number;
  file_url?: string;
}

interface SongListProps {
  songs: Song[];
  onSongSelect?: (song: Song) => void;
  currentSongId?: string | number;
  currentSongIndex?: number;
  onCurrentSongIndexChange?: (index: number) => void;
}

export function SongList({ 
  songs, 
  onSongSelect, 
  currentSongId,
  currentSongIndex,
  onCurrentSongIndexChange 
}: SongListProps) {
  const formatDuration = (duration: string | number) => {
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return duration;
  };

  const handleSongClick = (song: Song, index: number) => {
    onSongSelect?.(song);
    onCurrentSongIndexChange?.(index);
  };

  return (
    <div className="mt-12">
      <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider pb-4 border-b">
        <div className="col-span-1">#</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-4">ARTIST</div>
        <div className="col-span-2 text-right">DURATION</div>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)]">
        {songs.map((song, index) => (
          <div 
            key={song.id}
            onClick={() => handleSongClick(song, index)}
            className={`grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100 cursor-pointer ${
              (currentSongId === song.id || currentSongIndex === index) ? 'bg-purple-50' : ''
            }`}
          >
            <div className="col-span-1 text-gray-400">{index + 1}</div>
            <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-gray-400" />
              {song.title}
            </div>
            <div className="col-span-4 text-gray-500">{song.artist}</div>
            <div className="col-span-2 text-right text-gray-500">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}