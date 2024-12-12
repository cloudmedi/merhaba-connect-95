import { Table, TableBody } from "@/components/ui/table";
import { MusicTableHeader } from "./MusicTableHeader";
import { MusicTableRow } from "./MusicTableRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TablePagination } from "./TablePagination";
import type { Song } from "@/types/api";

interface MusicTableProps {
  songs: Song[];
  selectedSongs: Song[];
  onSelectSong: (song: Song, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  isLoading: boolean;
  totalCount: number;
  onDelete: (id: string) => void;
}

export function MusicTable({
  songs,
  selectedSongs,
  onSelectSong,
  onSelectAll,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  isLoading,
  totalCount,
  onDelete
}: MusicTableProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  return (
    <div className="flex-1 border rounded-lg bg-white overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b">
        <Table>
          <MusicTableHeader
            onSelectAll={onSelectAll}
            selectedSongs={selectedSongs}
            songs={songs}
          />
        </Table>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableBody>
            {songs.map((song) => (
              <MusicTableRow
                key={song.id}
                song={song}
                isSelected={selectedSongs.some(s => s.id === song.id)}
                onSelect={(checked) => onSelectSong(song, checked)}
                onDelete={() => onDelete(song.id)}
                formatDuration={(duration) => {
                  if (!duration) return "0:00";
                  const minutes = Math.floor(duration / 60);
                  const seconds = duration % 60;
                  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="sticky bottom-0 border-t bg-white p-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalCount}
        />
      </div>
    </div>
  );
}