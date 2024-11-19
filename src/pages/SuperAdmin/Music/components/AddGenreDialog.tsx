import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Check } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Genre {
  id: number;
  name: string;
}

interface AddGenreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (genreIds: number[]) => void;
}

export function AddGenreDialog({ isOpen, onClose, onConfirm }: AddGenreDialogProps) {
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  
  const genres: Genre[] = [
    { id: 1, name: "Rock" },
    { id: 2, name: "Pop" },
    { id: 3, name: "Jazz" },
    { id: 4, name: "Classical" },
    { id: 5, name: "Hip Hop" },
    { id: 6, name: "Electronic" },
    { id: 7, name: "R&B" },
    { id: 8, name: "Country" },
    { id: 9, name: "Blues" },
    { id: 10, name: "Folk" },
  ];

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedGenres.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one genre",
        variant: "destructive",
      });
      return;
    }
    onConfirm(selectedGenres);
    setSelectedGenres([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Music className="h-5 w-5 text-primary" />
            Add Genres
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border border-border/10 bg-background/5 p-4">
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-accent cursor-pointer"
                onClick={() => handleGenreToggle(genre.id)}
              >
                <Checkbox
                  checked={selectedGenres.includes(genre.id)}
                  onCheckedChange={() => handleGenreToggle(genre.id)}
                />
                <span className="text-sm font-medium">{genre.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Add Selected Genres</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}