import { Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

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
  isPlaying?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export function SongList({ 
  songs, 
  onSongSelect, 
  currentSongId,
  currentSongIndex,
  onCurrentSongIndexChange,
  isPlaying = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: SongListProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider pb-4 border-b">
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
            className={`grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-all duration-200 items-center border-b border-gray-100 cursor-pointer group ${
              (currentSongId === song.id || currentSongIndex === index) 
                ? 'bg-purple-50/50' 
                : ''
            }`}
          >
            <div className="col-span-1 text-gray-400 group-hover:text-gray-900 transition-colors">
              {index + 1}
            </div>
            <div className="col-span-5 font-medium text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Music2 className={`w-4 h-4 ${
                  currentSongId === song.id 
                    ? 'text-purple-600' 
                    : 'text-gray-400 group-hover:text-purple-600'
                }`} />
              </div>
              <span className={`truncate ${
                currentSongId === song.id 
                  ? 'text-purple-600' 
                  : 'group-hover:text-purple-600'
              }`}>
                {song.title}
              </span>
            </div>
            <div className="col-span-4 text-gray-600 truncate group-hover:text-gray-900">
              {song.artist}
            </div>
            <div className="col-span-2 text-right text-gray-600 group-hover:text-gray-900">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}

        {/* Infinite scroll trigger */}
        <div ref={ref} className="py-4 text-center">
          {isFetchingNextPage ? (
            <div className="text-sm text-gray-500">Loading more songs...</div>
          ) : hasNextPage ? (
            <div className="text-sm text-gray-400">Scroll for more songs</div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}