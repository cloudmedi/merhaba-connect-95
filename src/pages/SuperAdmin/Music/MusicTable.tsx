import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Music2 } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  genre: string[] | null;
  duration: number | null;
  file_url: string;
  artwork_url: string | null;
  created_at: string;
}

interface MusicTableProps {
  songs: Song[];
  isLoading: boolean;
}

export function MusicTable({ songs, isLoading }: MusicTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
        <Music2 className="w-12 h-12 mb-2" />
        <p>No songs uploaded yet</p>
        <p className="text-sm">Upload some music to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Uploaded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist || '-'}</TableCell>
              <TableCell>{song.album || '-'}</TableCell>
              <TableCell>{song.genre?.join(', ') || '-'}</TableCell>
              <TableCell>{song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '-'}</TableCell>
              <TableCell>{format(new Date(song.created_at), 'MMM d, yyyy')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}