import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MusicTableRowProps {
  song: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: (id: string) => void;
  formatDuration: (duration?: number) => string;
}

export function MusicTableRow({
  song,
  isSelected,
  onSelect,
  onDelete,
  formatDuration,
}: MusicTableRowProps) {
  return (
    <TableRow className="group hover:bg-gray-50/50">
      <TableCell className="w-[30px]">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
            {song.artwork_url && (
              <img
                src={song.artwork_url}
                alt={song.title}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
          <span className="text-sm font-medium text-gray-900 truncate">
            {song.title}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-xs text-gray-500">{song.artist || '-'}</TableCell>
      <TableCell className="text-xs text-gray-500">{song.album || '-'}</TableCell>
      <TableCell>
        {song.genre ? (
          <div className="flex gap-2">
            {song.genre.map((g: string) => (
              <span
                key={g}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500"
              >
                {g}
              </span>
            ))}
          </div>
        ) : '-'}
      </TableCell>
      <TableCell className="text-right text-xs text-gray-500">
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