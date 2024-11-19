import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { GenresHeader } from "./GenresHeader";
import { GenresTable } from "./GenresTable";
import { GenresDialog } from "./GenresDialog";
import { Genre } from "./types";

export const availableGenres: Genre[] = [
  { id: 1, name: "Pop" },
  { id: 2, name: "Rock" },
  { id: 3, name: "Jazz" },
  { id: 4, name: "Hip Hop" },
  { id: 5, name: "Classical" },
];

export function GenresContent() {
  const [genres, setGenres] = useState<Genre[]>(availableGenres);
  const [newGenreName, setNewGenreName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!newGenreName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a genre name",
        variant: "destructive",
      });
      return;
    }

    if (editingGenre) {
      const updatedGenres = genres.map(genre => 
        genre.id === editingGenre.id 
          ? { ...genre, name: newGenreName.trim() }
          : genre
      );
      setGenres(updatedGenres);
      availableGenres.length = 0;
      availableGenres.push(...updatedGenres);
      toast({
        title: "Success",
        description: "Genre updated successfully",
      });
    } else {
      const newGenre: Genre = {
        id: Math.max(...genres.map(g => g.id), 0) + 1,
        name: newGenreName.trim(),
      };
      const updatedGenres = [...genres, newGenre];
      setGenres(updatedGenres);
      availableGenres.length = 0;
      availableGenres.push(...updatedGenres);
      toast({
        title: "Success",
        description: "Genre created successfully",
      });
    }
    
    setNewGenreName("");
    setEditingGenre(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedGenres = genres.filter((genre) => genre.id !== id);
    setGenres(updatedGenres);
    availableGenres.length = 0;
    availableGenres.push(...updatedGenres);
    
    toast({
      title: "Success",
      description: "Genre deleted successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <GenresHeader 
        onNewGenre={() => {
          setEditingGenre(null);
          setNewGenreName("");
          setIsDialogOpen(true);
        }}
      />
      
      <GenresTable 
        genres={genres}
        onEdit={(genre) => {
          setEditingGenre(genre);
          setNewGenreName(genre.name);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />

      <GenresDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingGenre={editingGenre}
        newGenreName={newGenreName}
        setNewGenreName={setNewGenreName}
        onSave={handleSave}
      />
    </div>
  );
}