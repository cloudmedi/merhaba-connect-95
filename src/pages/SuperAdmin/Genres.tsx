import { useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Genre {
  id: number;
  name: string;
}

// Create a global variable to store genres that can be accessed from other components
export const availableGenres: Genre[] = [
  { id: 1, name: "Pop" },
  { id: 2, name: "Rock" },
  { id: 3, name: "Jazz" },
  { id: 4, name: "Hip Hop" },
  { id: 5, name: "Classical" },
];

export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>(availableGenres);
  const [newGenreName, setNewGenreName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const { toast } = useToast();

  const handleCreateGenre = () => {
    if (!newGenreName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a genre name",
        variant: "destructive",
      });
      return;
    }

    const newGenre: Genre = {
      id: Math.max(...genres.map(g => g.id), 0) + 1,
      name: newGenreName.trim(),
    };

    const updatedGenres = [...genres, newGenre];
    setGenres(updatedGenres);
    availableGenres.length = 0;
    availableGenres.push(...updatedGenres);
    
    setNewGenreName("");
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Genre created successfully",
    });
  };

  const handleEditGenre = () => {
    if (!editingGenre || !newGenreName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a genre name",
        variant: "destructive",
      });
      return;
    }

    const updatedGenres = genres.map(genre => 
      genre.id === editingGenre.id 
        ? { ...genre, name: newGenreName.trim() }
        : genre
    );

    setGenres(updatedGenres);
    availableGenres.length = 0;
    availableGenres.push(...updatedGenres);
    
    setNewGenreName("");
    setEditingGenre(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Genre updated successfully",
    });
  };

  const handleDeleteGenre = (id: number) => {
    const updatedGenres = genres.filter((genre) => genre.id !== id);
    setGenres(updatedGenres);
    availableGenres.length = 0;
    availableGenres.push(...updatedGenres);
    
    toast({
      title: "Success",
      description: "Genre deleted successfully",
    });
  };

  const openEditDialog = (genre: Genre) => {
    setEditingGenre(genre);
    setNewGenreName(genre.name);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#1A1F2C]">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Genres</h1>
              <p className="text-sm text-gray-400 mt-1">Manage music genres for playlists</p>
            </div>
            <Button 
              onClick={() => {
                setEditingGenre(null);
                setNewGenreName("");
                setIsDialogOpen(true);
              }}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" /> New Genre
            </Button>
          </div>

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
                            onClick={() => openEditDialog(genre)}
                            className="hover:bg-purple-900/50"
                          >
                            <Pencil className="h-4 w-4 text-purple-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteGenre(genre.id)}
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
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#242B3D] text-white border-none">
          <DialogHeader>
            <DialogTitle>{editingGenre ? 'Edit Genre' : 'Create New Genre'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="genreName" className="text-gray-300">Genre Name</Label>
              <Input
                id="genreName"
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                placeholder="Enter genre name"
                className="bg-[#1A1F2C] border-gray-700 text-white"
              />
            </div>
            <Button 
              onClick={editingGenre ? handleEditGenre : handleCreateGenre}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              {editingGenre ? 'Update Genre' : 'Create Genre'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}