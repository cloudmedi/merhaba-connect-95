import { useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Genre {
  id: number;
  name: string;
}

export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenreName, setNewGenreName] = useState("");
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
      id: genres.length + 1,
      name: newGenreName.trim(),
    };

    setGenres([...genres, newGenre]);
    setNewGenreName("");
    
    toast({
      title: "Success",
      description: "Genre created successfully",
    });
  };

  const handleDeleteGenre = (id: number) => {
    setGenres(genres.filter((genre) => genre.id !== id));
    toast({
      title: "Success",
      description: "Genre deleted successfully",
    });
  };

  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
                  <Plus className="w-4 h-4 mr-2" /> New Genre
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Genre</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="genreName">Genre Name</Label>
                    <Input
                      id="genreName"
                      value={newGenreName}
                      onChange={(e) => setNewGenreName(e.target.value)}
                      placeholder="Enter genre name"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateGenre}
                    className="w-full bg-[#FFD700] text-black hover:bg-[#E6C200]"
                  >
                    Create Genre
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {genres.map((genre) => (
                    <TableRow key={genre.id}>
                      <TableCell>{genre.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteGenre(genre.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}