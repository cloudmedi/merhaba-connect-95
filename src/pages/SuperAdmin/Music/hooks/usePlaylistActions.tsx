import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePlaylistActions = () => {
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToPlaylist = (selectedSongs: any[]) => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select songs to add to playlist",
        variant: "destructive",
      });
      return;
    }
    setIsPlaylistDialogOpen(true);
  };

  return {
    isPlaylistDialogOpen,
    setIsPlaylistDialogOpen,
    handleAddToPlaylist,
  };
};