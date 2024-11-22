import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  hasItems: boolean;
}

export function TableHeader({ onSelectAll, isAllSelected, hasItems }: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b">
        <TableHead className="w-[30px]">
          <Checkbox
            checked={isAllSelected && hasItems}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
          />
        </TableHead>
        <TableHead className="font-medium text-gray-700">Title</TableHead>
        <TableHead className="font-medium text-gray-700">Artist</TableHead>
        <TableHead className="font-medium text-gray-700">Album</TableHead>
        <TableHead className="font-medium text-gray-700">Genres</TableHead>
        <TableHead className="font-medium text-gray-700 text-right">Duration</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}