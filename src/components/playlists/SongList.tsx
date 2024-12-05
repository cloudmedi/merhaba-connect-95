import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music2 } from "lucide-react";

interface Song {
  id: string | number;
  title: string;
  artist: string;
  duration: string | number;
  file_url?: string;
}

interface SongListProps {
  songs: Song[];
  onSongSelect?: (song: Song) => void;
  currentSongIndex?: number;
  onCurrentSongIndexChange?: (index: number) => void;
  isPlaying?: boolean;
}

export function SongList({ 
  songs, 
  onSongSelect, 
  currentSongIndex,
  onCurrentSongIndexChange,
  isPlaying = false
}: SongListProps) {
  return (
    <div className="relative overflow-auto max-h-[600px]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song, index) => (
            <TableRow 
              key={song.id}
              className={`cursor-pointer hover:bg-gray-50 ${
                currentSongIndex === index ? 'bg-purple-50' : ''
              }`}
              onClick={() => {
                onSongSelect?.(song);
                onCurrentSongIndexChange?.(index);
              }}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Music2 className={`w-4 h-4 ${
                    currentSongIndex === index && isPlaying 
                      ? 'text-purple-600' 
                      : 'text-gray-400'
                  }`} />
                  {index + 1}
                </div>
              </TableCell>
              <TableCell className={`font-medium ${
                currentSongIndex === index ? 'text-purple-600' : ''
              }`}>
                {song.title}
              </TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell className="text-right">{song.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}