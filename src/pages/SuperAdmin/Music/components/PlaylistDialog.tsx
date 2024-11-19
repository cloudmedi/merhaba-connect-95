import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, PlayCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (playlistIds: number[]) => void;
}

export function PlaylistDialog({ isOpen, onClose, onConfirm }: PlaylistDialogProps) {
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const { toast } = useToast();

  // Mock playlists data - in a real app, this would come from an API
  const playlists = [
    { id: 1, name: "Summer Hits" },
    { id: 2, name: "Chill Vibes" },
    { id: 3, name: "Workout Mix" },
    { id: 4, name: "Party Time" },
    { id: 5, name: "Focus Music" },
  ];

  const handlePlaylistToggle = (playlistId: number) => {
    setSelectedPlaylists(prev => {
      if (prev.includes(playlistId)) {
        return prev.filter(id => id !== playlistId);
      } else {
        return [...prev, playlistId];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedPlaylists.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one playlist",
        variant: "destructive",
      });
      return;
    }
    onConfirm(selectedPlaylists);
    setSelectedPlaylists([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PlayCircle className="h-5 w-5 text-primary" />
            Add to Playlists
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="grid grid-cols-2 gap-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-accent cursor-pointer"
                onClick={() => handlePlaylistToggle(playlist.id)}
              >
                <Checkbox
                  checked={selectedPlaylists.includes(playlist.id)}
                  onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                />
                <span className="text-sm font-medium">{playlist.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Add to Selected Playlists</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}