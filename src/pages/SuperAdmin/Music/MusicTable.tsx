import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Music2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  duration: string;
  file: File;
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
}

export function MusicTable({ 
  songs, 
  selectedSongs, 
  onSelectAll, 
  onSelectSong,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage
}: MusicTableProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
        <Music2 className="w-12 h-12 mb-2" />
        <p>No songs uploaded yet</p>
        <p className="text-sm">Upload some music to get started</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSongs = songs.slice(startIndex, endIndex);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate range of visible page numbers
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(2, endPage - maxVisiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[calc(100vh-400px)] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedSongs.length === songs.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSongs.map((song) => (
              <TableRow
                key={song.id}
                className={`cursor-pointer ${
                  selectedSongs.some((s) => s.id === song.id)
                    ? "bg-purple-50"
                    : ""
                }`}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedSongs.some((s) => s.id === song.id)}
                    onCheckedChange={(checked) => onSelectSong(song, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell>{song.genres.join(", ") || "-"}</TableCell>
                <TableCell className="text-right">{song.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, songs.length)} of {songs.length} songs
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}