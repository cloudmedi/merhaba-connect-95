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

const defaultArtwork = "/placeholder.svg";

const formatDuration = (duration?: number) => {
  if (!duration) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

  const handlePlaySong = (song: Song) => {
    setCurrentlyPlaying(song);
    setIsPlaying(true);
    setCurrentPlaylistId(Date.now().toString()); // Unique ID for the current playlist
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
    <div className="flex flex-col h-[calc(100vh-280px)] border rounded-lg">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full rounded-md" type="auto">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-white border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30px] bg-white">
                  <Checkbox
                    checked={selectedSongs.length === songs.length}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700 bg-white">Title</TableHead>
                <TableHead className="font-medium text-gray-700 bg-white">Artist</TableHead>
                <TableHead className="font-medium text-gray-700 bg-white">Album</TableHead>
                <TableHead className="font-medium text-gray-700 bg-white">Genres</TableHead>
                <TableHead className="font-medium text-gray-700 bg-white text-right">Duration</TableHead>
                <TableHead className="w-[50px] bg-white"></TableHead>
              </TableRow>
            </TableHeader>
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
        </ScrollArea>
      </div>

      <div className="sticky bottom-0 bg-white border-t px-4 py-2">
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
            id: currentPlaylistId,
            title: "Now Playing",
            artwork: currentlyPlaying.artwork_url || defaultArtwork,
            songs: transformedSongs
          }}
          onClose={() => {
            setCurrentlyPlaying(null);
            setIsPlaying(false);
          }}
          onSongChange={(index) => setCurrentSongIndex(index)}
          onPlayStateChange={setIsPlaying}
          currentSongId={currentlyPlaying.id}
        />
      )}
    </div>
  );
}