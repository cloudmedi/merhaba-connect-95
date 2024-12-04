import { ScrollArea } from "@/components/ui/scroll-area";
import { Music2 } from "lucide-react";
import { formatDuration } from "../utils/playlistUtils";

interface PlaylistSongListProps {
  songs: any[];
  onSongSelect: (song: any) => void;
  currentSongIndex?: number;
  onCurrentSongIndexChange?: (index: number) => void;
  isPlaying?: boolean;
}

export function PlaylistSongList({
  songs,
  onSongSelect,
  currentSongIndex,
  onCurrentSongIndexChange,
  isPlaying
}: PlaylistSongListProps) {
  console.log('Rendering PlaylistSongList with', songs?.length, 'songs');
  
  return (
    <div className="mt-12">
      <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider pb-4 border-b">
        <div className="col-span-1">#</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-4">ARTIST</div>
        <div className="col-span-2 text-right">DURATION</div>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-1">
          {songs?.map((song, index) => (
            <div 
              key={`${song.id}-${index}`}
              onClick={() => onSongSelect(song)}
              className={`grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100 cursor-pointer ${
                currentSongIndex === index ? 'bg-purple-50/50' : ''
              }`}
            >
              <div className="col-span-1 text-gray-400">{index + 1}</div>
              <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
                <Music2 className={`w-4 h-4 ${
                  currentSongIndex === index && isPlaying ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <span className={
                  currentSongIndex === index ? 'text-purple-600' : ''
                }>{song.title}</span>
              </div>
              <div className="col-span-4 text-gray-500">{song.artist || 'Unknown Artist'}</div>
              <div className="col-span-2 text-right text-gray-500">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}