import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Song } from "../types";

export const usePlaylistActions = () => {
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToPlaylist = (selectedSongs: Song[]) => {
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

  const handlePlaylistConfirm = (playlistIds: number[]) => {
    toast({
      title: "Success",
      description: "Songs added to playlists successfully",
    });
    setIsPlaylistDialogOpen(false);
  };

  return {
    isPlaylistDialogOpen,
    setIsPlaylistDialogOpen,
    handleAddToPlaylist,
    handlePlaylistConfirm
  };
};