import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Play, Pause } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  artwork_url?: string;
  file_url: string;
}

interface SongTableRowProps {
  song: Song;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onPlay: () => void;
  formatDuration: (duration?: number) => string;
  defaultArtwork: string;
  onDelete: (id: string) => void;
  isPlaying?: boolean;
  currentlyPlayingId?: string;
}

export function SongTableRow({
  song,
  isSelected,
  onSelect,
  onPlay,
  formatDuration,
  defaultArtwork,
  onDelete,
  isPlaying,
  currentlyPlayingId,
}: SongTableRowProps) {
  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=150&quality=85&format=webp`;
  };

  const isCurrentSong = song.id === currentlyPlayingId;

  return (
    <TableRow className={`hover:bg-gray-50/50 group ${isCurrentSong ? 'bg-purple-50' : ''}`}>
      <TableCell className="w-[30px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="relative group/artwork w-10 h-10">
            <img
              src={getOptimizedImageUrl(song.artwork_url || defaultArtwork)}
              alt={song.title}
              className="w-full h-full object-cover rounded group-hover/artwork:opacity-75 transition-opacity"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = defaultArtwork;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/artwork:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70"
                onClick={onPlay}
              >
                {isCurrentSong && isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </Button>
            </div>
          </div>
          <span className={`font-medium ${isCurrentSong ? 'text-purple-600' : 'text-gray-900'}`}>
            {song.title}
          </span>
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
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={() => onDelete(song.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}