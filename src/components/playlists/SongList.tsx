import { Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

interface SongListProps {
  songs: Song[];
  formatDuration: (duration: string) => string;
}

export function SongList({ songs, formatDuration }: SongListProps) {
  return (
    <div className="mt-12">
      <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider pb-4 border-b">
        <div className="col-span-1">#</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-4">ARTIST</div>
        <div className="col-span-2 text-right">DURATION</div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {songs && songs.length > 0 ? (
          songs.map((song, index) => (
            <div 
              key={song.id}
              className="grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100"
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
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No songs in this playlist
          </div>
        )}
      </ScrollArea>
    </div>
  );
}