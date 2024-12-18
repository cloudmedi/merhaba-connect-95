import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Genre } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";

interface GenresTableProps {
  genres: Genre[];
  onEdit: (genre: Genre) => void;
  onDelete: (id: string) => void;
}

export function GenresTable({ genres, onEdit, onDelete }: GenresTableProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return '-';
    }
  };

  const handleDelete = (genre: Genre) => {
    if (!genre._id) {
      console.error('No valid ID found for genre:', genre);
      return;
    }
    onDelete(genre._id);
  };

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[200px] hidden md:table-cell">Description</TableHead>
              <TableHead className="min-w-[100px]">Songs</TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">Created At</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre._id}>
                <TableCell className="font-medium">{genre.name}</TableCell>
                <TableCell className="hidden md:table-cell">{genre.description}</TableCell>
                <TableCell>{genre.songCount || 0}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(genre.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(genre)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(genre)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
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
    </div>
  );
}