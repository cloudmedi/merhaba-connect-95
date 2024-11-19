import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Genre</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-2">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onConfirm(genre.id);
                  toast({
                    title: "Genre Updated",
                    description: `Selected songs have been updated to ${genre.name}`,
                  });
                }}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}