import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { Mood } from "./types";

interface MoodsTableProps {
  moods: Mood[];
  onEdit: (mood: Mood) => void;
  onDelete: (id: number) => void;
}

export function MoodsTable({ moods, onEdit, onDelete }: MoodsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moods.map((mood) => (
          <TableRow key={mood.id}>
            <TableCell>{mood.icon}</TableCell>
            <TableCell>{mood.name}</TableCell>
            <TableCell>{mood.description}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(mood)}
                  className="hover:text-purple-600"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(mood.id)}
                  className="hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}