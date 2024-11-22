import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  if (isLoading) {
    return <DataTableLoader />;
  }

  if (songs.length === 0) {
    return <EmptyState />;
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const defaultArtwork = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

  const handlePlaySong = (song: Song) => {
    const songIndex = songs.findIndex(s => s.id === song.id);
    setCurrentSongIndex(songIndex);
    setCurrentlyPlaying(song);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="space-y-4 bg-white rounded-lg shadow">
      <ScrollArea className="h-[calc(100vh-400px)]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedSongs.length === songs.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
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
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={Math.min(startIndex + songs.length, totalCount)}
        totalItems={totalCount}
      />

      {currentlyPlaying && (
        <MusicPlayer
          playlist={{
            title: "Now Playing",
            artwork: currentlyPlaying.artwork_url || defaultArtwork,
            songs: songs.map(song => ({
              id: song.id,
              title: song.title,
              artist: song.artist || "Unknown Artist",
              duration: song.duration?.toString() || "0:00",
              file_url: song.file_url
            }))
          }}
          initialSongIndex={currentSongIndex}
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}
    </div>
  );
}