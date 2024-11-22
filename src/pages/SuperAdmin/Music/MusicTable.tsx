import React from "react";
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
import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongTableRow } from "@/components/music/SongTableRow";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedSongs.length === songs.length && songs.length > 0}
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
                onPlay={() => setCurrentlyPlaying(song)}
                formatDuration={formatDuration}
                defaultArtwork={defaultArtwork}
                onDelete={() => onDelete(song.id)}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{endIndex} of {totalCount} songs
        </p>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(currentPage - 1)}
                className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage);
                return distance === 0 || distance === 1 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <PaginationItem>
                        <PaginationLink className="cursor-default">...</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => onPageChange(page)}
                          isActive={currentPage === page}
                          className={`cursor-pointer ${currentPage === page ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-gray-100"}`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer ${currentPage === page ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-gray-100"}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(currentPage + 1)}
                className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

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