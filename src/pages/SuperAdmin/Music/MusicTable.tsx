import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";
import { EmptyState } from "./components/EmptyState";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongTableRow } from "@/components/music/SongTableRow";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { TableHeader } from "./components/TableHeader";
import { TableFooter } from "./components/TableFooter";

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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + songs.length, totalCount);

  return (
    <div className="space-y-4 bg-white rounded-lg shadow">
      <ScrollArea className="h-[calc(100vh-400px)]">
        <Table>
          <TableHeader 
            onSelectAll={onSelectAll}
            isAllSelected={selectedSongs.length === songs.length}
            hasItems={songs.length > 0}
          />
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
                onDelete={() => onDelete(song.id)}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <TableFooter 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalCount={totalCount}
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