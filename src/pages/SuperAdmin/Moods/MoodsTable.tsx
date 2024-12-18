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
import { ScrollArea } from "@/components/ui/scroll-area";
import CatalogLoader from "@/components/loaders/CatalogLoader";

interface MoodsTableProps {
  moods: Mood[];
  isLoading: boolean;
  onEdit: (mood: Mood) => void;
  onDelete: (id: string) => void;
}

export function MoodsTable({ moods, isLoading, onEdit, onDelete }: MoodsTableProps) {
  if (isLoading) {
    return <CatalogLoader count={moods.length || 6} />;
  }

  const handleDelete = (mood: Mood) => {
    const moodId = mood._id || mood.id;
    if (!moodId) {
      console.error('No valid ID found for mood:', mood);
      return;
    }
    onDelete(moodId);
  };

  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moods.map((mood) => (
              <TableRow key={mood._id || mood.id}>
                <TableCell>{mood.icon}</TableCell>
                <TableCell>{mood.name}</TableCell>
                <TableCell className="hidden md:table-cell">{mood.description}</TableCell>
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
                      onClick={() => handleDelete(mood)}
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
      </ScrollArea>
    </div>
  );
}