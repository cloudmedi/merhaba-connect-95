import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface MusicTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  selectedSongs: any[];
  songs: any[];
}

export function MusicTableHeader({ onSelectAll, selectedSongs, songs }: MusicTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[30px]">
          <Checkbox
            checked={selectedSongs.length === songs.length}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Title</TableHead>
        <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Artist</TableHead>
        <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Album</TableHead>
        <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Genres</TableHead>
        <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500 text-right">Duration</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}