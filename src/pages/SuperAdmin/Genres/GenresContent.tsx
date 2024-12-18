import { useState, useEffect } from "react";
import { GenresHeader } from "./GenresHeader";
import { GenresTable } from "./GenresTable";
import { GenresDialog } from "./GenresDialog";
import { Genre } from "./types";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";

export function GenresContent() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const { toast } = useToast();

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/admin/genres');
      setGenres(response.data);
    } catch (error: any) {
      console.error('Error fetching genres:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch genres",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleCreate = async (newGenre: Pick<Genre, "name" | "description">) => {
    try {
      await axios.post('/admin/genres', newGenre);
      setIsDialogOpen(false);
      fetchGenres();
      toast({
        title: "Success",
        description: "Genre created successfully",
      });
    } catch (error: any) {
      console.error('Error creating genre:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create genre",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (updatedGenre: Genre) => {
    try {
      await axios.put(`/admin/genres/${updatedGenre.id}`, { 
        name: updatedGenre.name, 
        description: updatedGenre.description 
      });
      setIsDialogOpen(false);
      setEditingGenre(null);
      fetchGenres();
      toast({
        title: "Success",
        description: "Genre updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating genre:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update genre",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/admin/genres/${id}`);
      fetchGenres();
      toast({
        title: "Success",
        description: "Genre deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting genre:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete genre",
        variant: "destructive",
      });
    }
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