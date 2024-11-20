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
import { TablePagination } from "./components/TablePagination";
import { TrackArtwork } from "@/components/music/TrackArtwork";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Song } from "./hooks/useMusicLibrary";

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
  onPlaySong,
  isLoading
}: MusicTableProps) {
  const { toast } = useToast();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (songs.length === 0) {
    return <EmptyState />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, songs.length);
  const currentSongs = songs.slice(startIndex, endIndex);

  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    } else {
      toast({
        title: "Now Playing",
        description: `${song.title} by ${song.artist || 'Unknown Artist'}`,
      });
    }
  };

  const formatDuration = (duration: number | null | undefined) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
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
            {currentSongs.map((song) => (
              <TableRow
                key={song.id}
                className="hover:bg-gray-50/50"
              >
                <TableCell className="w-[30px]">
                  <Checkbox 
                    checked={selectedSongs.some((s) => s.id === song.id)}
                    onCheckedChange={(checked) => onSelectSong(song, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <TrackArtwork
                      artwork={song.artwork_url}
                      title={song.title}
                      onPlay={() => handlePlaySong(song)}
                    />
                    <span className="font-medium text-gray-900">{song.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{song.artist || '-'}</TableCell>
                <TableCell className="text-gray-600">{song.album || '-'}</TableCell>
                <TableCell className="text-gray-600">{song.genre ? song.genre.join(", ") : "-"}</TableCell>
                <TableCell className="text-right text-gray-600">{formatDuration(song.duration)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={songs.length}
      />
    </div>
  );
}