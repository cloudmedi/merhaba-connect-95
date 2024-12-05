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

  const getBunnyUrl = (song: Song): string => {
    if (!song) return '';
    
    if (song.bunny_id) {
      return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    }
    
    if (song.file_url.startsWith('http')) {
      return song.file_url;
    }
    
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  const handlePlaySong = (song: Song) => {
    const songIndex = songs.findIndex(s => s.id === song.id);
    setCurrentSongIndex(songIndex);
    setCurrentlyPlaying(song);
    setIsPlaying(true);
    setCurrentPlaylistId('temp-playlist');
  };

  const handleSongChange = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentlyPlaying(songs[index]);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  const transformedSongs = songs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist || "Unknown Artist",
    duration: song.duration?.toString() || "0:00",
    file_url: getBunnyUrl(song),
    bunny_id: song.bunny_id
  }));

  return (
    <div className="space-y-4 bg-white rounded-lg shadow">
      <div className="border rounded-lg">
        <div className="relative">
          <ScrollArea className="h-[calc(100vh-280px)] rounded-md border" type="always">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-[30px] bg-white sticky top-0 z-20">
                    <Checkbox
                      checked={selectedSongs.length === songs.length}
                      onCheckedChange={(checked) => onSelectAll(checked as boolean)}
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
                {songs.slice(0, itemsPerPage).map((song) => (
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
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalCount}
      />

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
          onSongChange={handleSongChange}
          onPlayStateChange={setIsPlaying}
          currentSongId={currentlyPlaying.id}
        />
      )}
    </div>
  );
}