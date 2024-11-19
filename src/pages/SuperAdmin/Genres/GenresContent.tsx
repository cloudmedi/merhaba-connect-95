import { useState } from "react";
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

  return (
    <div className="max-w-4xl mx-auto bg-white">
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
        onDelete={(id) => {
          const updatedGenres = genres.filter((genre) => genre.id !== id);
          setGenres(updatedGenres);
          availableGenres.length = 0;
          availableGenres.push(...updatedGenres);
        }}
      />

      <GenresDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingGenre={editingGenre}
        newGenreName={newGenreName}
        setNewGenreName={setNewGenreName}
        onSave={() => {
          if (editingGenre) {
            const updatedGenres = genres.map(genre => 
              genre.id === editingGenre.id 
                ? { ...genre, name: newGenreName.trim() }
                : genre
            );
            setGenres(updatedGenres);
            availableGenres.length = 0;
            availableGenres.push(...updatedGenres);
          } else {
            const newGenre: Genre = {
              id: Math.max(...genres.map(g => g.id), 0) + 1,
              name: newGenreName.trim(),
            };
            const updatedGenres = [...genres, newGenre];
            setGenres(updatedGenres);
            availableGenres.length = 0;
            availableGenres.push(...updatedGenres);
          }
          setNewGenreName("");
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}