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
import { TablePagination } from "./components/TablePagination";
import { EmptyState } from "./components/EmptyState";
import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongTableRow } from "@/components/music/SongTableRow";

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
  onPlaySong?: (song: Song) => void;
  isLoading?: boolean;
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
  isLoading
}: MusicTableProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-52 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
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

  return (
    <div className="space-y-4 bg-white rounded-lg border">
      <ScrollArea className="h-[calc(100vh-400px)]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedSongs.length === songs.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Artist</TableHead>
              <TableHead className="font-medium">Album</TableHead>
              <TableHead className="font-medium">Genres</TableHead>
              <TableHead className="font-medium text-right">Duration</TableHead>
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
                onPlay={() => setCurrentlyPlaying(song)}
                formatDuration={formatDuration}
                defaultArtwork={defaultArtwork}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={(currentPage - 1) * itemsPerPage}
        endIndex={Math.min(currentPage * itemsPerPage, songs.length)}
        totalItems={songs.length}
      />

      {currentlyPlaying && (
        <MusicPlayer
          playlist={{
            title: currentlyPlaying.title,
            artwork: currentlyPlaying.artwork_url || defaultArtwork,
            songs: [{
              id: currentlyPlaying.id,
              title: currentlyPlaying.title,
              artist: currentlyPlaying.artist || "Unknown Artist",
              duration: currentlyPlaying.duration?.toString() || "0:00",
              file_url: currentlyPlaying.file_url
            }]
          }}
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}
    </div>
  );
}