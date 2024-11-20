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
import { Music2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      </Card>
    );
  }

  if (songs.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-gray-500 space-y-3">
          <Music2 className="w-12 h-12 text-gray-400" />
          <p className="text-lg font-medium">Henüz müzik yüklenmemiş</p>
          <p className="text-sm">Müzik eklemek için yukarıdaki "Upload Music" butonunu kullanın</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Artist</TableHead>
              <TableHead className="font-semibold">Album</TableHead>
              <TableHead className="font-semibold">Genre</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
              <TableHead className="font-semibold">Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.map((song) => (
              <TableRow key={song.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {song.artwork_url ? (
                      <img 
                        src={song.artwork_url} 
                        alt={song.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    {song.title}
                  </div>
                </TableCell>
                <TableCell>{song.artist || '-'}</TableCell>
                <TableCell>{song.album || '-'}</TableCell>
                <TableCell>
                  {song.genre?.length ? (
                    <div className="flex gap-1 flex-wrap">
                      {song.genre.map((g) => (
                        <span 
                          key={g} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {song.duration ? (
                    `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}`
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {format(new Date(song.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}