import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface GenreChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (genreId: number) => void;
}

export function GenreChangeDialog({ isOpen, onClose, onConfirm }: GenreChangeDialogProps) {
  const { toast } = useToast();
  
  // Mock genres data - in a real app, this would come from an API
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Music className="h-5 w-5 text-primary" />
            Select Genre
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border border-border/10 bg-background/5 p-4">
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => {
                  onConfirm(genre.id);
                  toast({
                    title: "Genre Updated",
                    description: `Selected songs have been updated to ${genre.name}`,
                  });
                }}
              >
                <Music className="h-4 w-4" />
                {genre.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}