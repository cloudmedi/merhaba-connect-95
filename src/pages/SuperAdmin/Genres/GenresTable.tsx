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
    <Card className="bg-[#242B3D] border-none shadow-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              <TableHead className="text-gray-400 w-[80%]">Name</TableHead>
              <TableHead className="text-gray-400 w-[20%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id} className="border-b border-gray-700">
                <TableCell className="font-medium text-white">{genre.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(genre)}
                      className="hover:bg-purple-900/50"
                    >
                      <Pencil className="h-4 w-4 text-purple-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(genre.id)}
                      className="hover:bg-red-900/50"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {genres.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-400 py-8">
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