import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "./components/EmptyState";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongTableRow } from "@/components/music/SongTableRow";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { TablePagination } from "./components/TablePagination";
import { useState } from "react";
import type { Song } from "./MusicContent";

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
  onEdit: (song: Song) => void;
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
  onDelete,
  onEdit
}: MusicTableProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const defaultArtwork = "/placeholder.svg";

  const handlePlaySong = (song: Song) => {
    if (currentlyPlaying?._id === song._id) {
      // If clicking the same song, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // If clicking a different song, start playing it
      setCurrentlyPlaying(song);
      setIsPlaying(true);
    }
  };

  const transformedSongs = songs.map(song => ({
    id: song._id,
    title: song.title,
    artist: song.artist || "Unknown Artist",
    duration: song.duration?.toString() || "0:00",
    file_url: song.fileUrl,
  }));

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <div className="h-[calc(100vh-280px)] relative">
          <ScrollArea className="h-full rounded-md" type="always">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30px] bg-white sticky top-0 z-20">
                    <Checkbox
                      checked={selectedSongs.length === songs.length}
                      onCheckedChange={onSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 bg-white sticky top-0 z-20">Title</TableHead>
                  <TableHead className="font-medium text-gray-700 bg-white sticky top-0 z-20">Artist</TableHead>
                  <TableHead className="font-medium text-gray-700 bg-white sticky top-0 z-20">Album</TableHead>
                  <TableHead className="font-medium text-gray-700 bg-white sticky top-0 z-20">Genres</TableHead>
                  <TableHead className="font-medium text-gray-700 text-right bg-white sticky top-0 z-20">Duration</TableHead>
                  <TableHead className="w-[50px] bg-white sticky top-0 z-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songs.map((song) => (
                  <SongTableRow
                    key={song._id}
                    song={song}
                    isSelected={selectedSongs.some((s) => s._id === song._id)}
                    onSelect={(checked) => onSelectSong(song, checked)}
                    onPlay={() => handlePlaySong(song)}
                    formatDuration={formatDuration}
                    defaultArtwork={defaultArtwork}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isPlaying={isPlaying && currentlyPlaying?._id === song._id}
                    currentlyPlayingId={currentlyPlaying?._id}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={(currentPage - 1) * itemsPerPage}
        endIndex={Math.min(currentPage * itemsPerPage, totalCount)}
        totalItems={totalCount}
      />

      {currentlyPlaying && (
        <MusicPlayer
          playlist={{
            id: 'temp-playlist',
            title: "Now Playing",
            artwork: currentlyPlaying.artworkUrl || defaultArtwork,
            songs: transformedSongs
          }}
          onClose={() => {
            setCurrentlyPlaying(null);
            setIsPlaying(false);
          }}
          initialSongIndex={songs.findIndex(s => s._id === currentlyPlaying._id)}
          onPlayStateChange={setIsPlaying}
          currentSongId={currentlyPlaying._id}
        />
      )}
    </div>
  );
}