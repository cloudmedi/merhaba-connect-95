import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Genre } from "./types";

interface GenresTableProps {
  genres: Genre[];
  onEdit: (genre: Genre) => void;
  onDelete: (id: number) => void;
}

export function GenresTable({ genres, onEdit, onDelete }: GenresTableProps) {
  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-600 w-[80%]">Name</TableHead>
              <TableHead className="text-gray-600 w-[20%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id} className="border-b border-gray-200">
                <TableCell className="font-medium text-gray-900">{genre.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(genre)}
                      className="hover:bg-purple-50 text-purple-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(genre.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {genres.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                  No genres added yet. Click "New Genre" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}