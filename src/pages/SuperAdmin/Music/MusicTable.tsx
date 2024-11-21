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
import { Button } from "@/components/ui/button";
import { MoreVertical, Play, Pause } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "./components/TablePagination";
import { EmptyState } from "./components/EmptyState";

interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  artwork_url?: string;
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
  onPlaySong,
  isLoading
}: MusicTableProps) {
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

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
              <TableRow
                key={song.id}
                className="hover:bg-gray-50/50 group"
              >
                <TableCell className="w-[30px]">
                  <Checkbox
                    checked={selectedSongs.some((s) => s.id === song.id)}
                    onCheckedChange={(checked) => onSelectSong(song, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative group w-10 h-10">
                      <img
                        src={song.artwork_url || "/placeholder.svg"}
                        alt={song.title}
                        className="w-full h-full object-cover rounded group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70"
                          onClick={() => onPlaySong?.(song)}
                        >
                          <Play className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">{song.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{song.artist || '-'}</TableCell>
                <TableCell className="text-gray-600">{song.album || '-'}</TableCell>
                <TableCell className="text-gray-600">
                  {song.genre ? (
                    <div className="flex gap-2">
                      {song.genre.map((g) => (
                        <span
                          key={g}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {formatDuration(song.duration)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
        startIndex={(currentPage - 1) * itemsPerPage}
        endIndex={Math.min(currentPage * itemsPerPage, songs.length)}
        totalItems={songs.length}
      />
    </div>
  );
}