import { useState } from "react";
import { GenresHeader } from "./GenresHeader";
import { GenresTable } from "./GenresTable";
import { GenresDialog } from "./GenresDialog";
import { Genre } from "./types";
import { useToast } from "@/components/ui/use-toast";

const initialGenres: Genre[] = [
  {
    id: 1,
    name: "Pop",
    description: "Popular contemporary music",
    songCount: 150,
    createdAt: "2024-02-20",
  },
  {
    id: 2,
    name: "Rock",
    description: "Guitar-driven music with strong beats",
    songCount: 120,
    createdAt: "2024-02-19",
  },
  {
    id: 3,
    name: "Jazz",
    description: "Improvisational music with complex harmonies",
    songCount: 80,
    createdAt: "2024-02-18",
  },
];

export function GenresContent() {
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const { toast } = useToast();

  const handleCreate = (newGenre: Omit<Genre, "id" | "songCount" | "createdAt">) => {
    const genre: Genre = {
      ...newGenre,
      id: genres.length + 1,
      songCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGenres([...genres, genre]);
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Genre created successfully",
    });
  };

  const handleEdit = (updatedGenre: Genre) => {
    setGenres(genres.map(genre => 
      genre.id === updatedGenre.id ? updatedGenre : genre
    ));
    setIsDialogOpen(false);
    setEditingGenre(null);
    toast({
      title: "Success",
      description: "Genre updated successfully",
    });
  };

  const handleDelete = (id: number) => {
    setGenres(genres.filter(genre => genre.id !== id));
    toast({
      title: "Success",
      description: "Genre deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <GenresHeader 
        onCreateNew={() => {
          setEditingGenre(null);
          setIsDialogOpen(true);
        }}
      />
      <GenresTable 
        genres={genres}
        onEdit={(genre) => {
          setEditingGenre(genre);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />
      <GenresDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        genre={editingGenre}
        onSubmit={editingGenre ? handleEdit : handleCreate}
      />
    </div>
  );
}