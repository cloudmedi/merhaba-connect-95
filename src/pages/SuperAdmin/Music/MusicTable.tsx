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

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  duration: string;
  file: File;
  artwork?: string;
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
  onPlaySong
}: MusicTableProps) {
  const { toast } = useToast();

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
        description: `${song.title} by ${song.artist}`,
      });
    }
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
              <TableHead className="w-[250px]">Title</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TrackArtwork
                      artwork={song.artwork}
                      title={song.title}
                      onPlay={() => handlePlaySong(song)}
                    />
                    <span className="font-medium">{song.title}</span>
                  </div>
                </TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell>{song.genres.join(", ") || "-"}</TableCell>
                <TableCell className="text-right">{song.duration}</TableCell>
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