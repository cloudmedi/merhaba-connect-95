import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";

interface MoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (moodId: number) => void;
}

export function MoodDialog({ isOpen, onClose, onConfirm }: MoodDialogProps) {
  // Mock moods data - in a real app, this would come from an API
  const moods = [
    { id: 1, name: "Happy" },
    { id: 2, name: "Sad" },
    { id: 3, name: "Energetic" },
    { id: 4, name: "Calm" },
    { id: 5, name: "Romantic" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-5 w-5 text-primary" />
            Select Mood
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="grid grid-cols-2 gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.id}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => {
                  onConfirm(mood.id);
                  onClose();
                }}
              >
                <Heart className="h-4 w-4" />
                {mood.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}