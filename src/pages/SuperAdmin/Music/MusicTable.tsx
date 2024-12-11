import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "./components/EmptyState";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongTableRow } from "@/components/music/SongTableRow";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { TablePagination } from "./components/TablePagination";

interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  artwork_url?: string;
  file_url: string;
  bunny_id?: string;
  created_at: string;
}

interface MusicTableProps {
  songs: Song[];
  selectedSongs: Song[];
  onSelectAll: (checked: boolean) => void;
  onSelectSong: (song: Song, checked: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  isLoading?: boolean;
  totalCount: number;
  onDelete: (id: string) => void;
}

const formatDuration = (duration?: number) => {
  if (!duration) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const defaultArtwork = "/placeholder.svg";

export function MusicTable({
  songs,
  selectedSongs,
  onSelectAll,
  onSelectSong,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  isLoading,
  totalCount,
  onDelete
}: MusicTableProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySong = (song: Song) => {
    if (currentlyPlaying?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(song);
      setIsPlaying(true);
    }
  };

  const transformedSongs = songs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist || 'Unknown Artist',
    duration: song.duration || 0,
    artwork_url: song.artwork_url || defaultArtwork,
    file_url: song.file_url
  }));

  if (isLoading) {
    return <DataTableLoader />;
  }

  if (songs.length === 0) {
    return <EmptyState />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] bg-white border rounded-lg overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30px] py-4">
                <Checkbox
                  checked={selectedSongs.length === songs.length}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="font-medium text-gray-700">Title</TableHead>
              <TableHead className="font-medium text-gray-700">Artist</TableHead>
              <TableHead className="font-medium text-gray-700">Album</TableHead>
              <TableHead className="font-medium text-gray-700">Genres</TableHead>
              <TableHead className="font-medium text-gray-700 text-right">Duration</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <ScrollArea className="flex-1">
        <div className="min-h-0">
          <Table>
            <TableBody>
              {songs.map((song) => (
                <SongTableRow
                  key={song.id}
                  song={song}
                  isSelected={selectedSongs.some((s) => s.id === song.id)}
                  onSelect={(checked) => onSelectSong(song, checked)}
                  onPlay={() => handlePlaySong(song)}
                  formatDuration={formatDuration}
                  defaultArtwork={defaultArtwork}
                  onDelete={() => onDelete(song.id)}
                  isPlaying={isPlaying}
                  currentlyPlayingId={currentlyPlaying?.id}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 border-t bg-white p-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalCount}
        />
      </div>

      {currentlyPlaying && (
        <MusicPlayer
          playlist={{
            title: "Now Playing",
            artwork: currentlyPlaying.artwork_url || defaultArtwork,
            songs: transformedSongs
          }}
          onClose={() => {
            setCurrentlyPlaying(null);
            setIsPlaying(false);
          }}
          onPlayStateChange={setIsPlaying}
          currentSongId={currentlyPlaying.id}
          autoPlay={true}
        />
      )}
    </div>
  );
}