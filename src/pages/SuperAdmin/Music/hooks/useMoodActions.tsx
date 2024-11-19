import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Song } from "../types";

export const useMoodActions = () => {
  const [isMoodDialogOpen, setIsMoodDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddMood = (selectedSongs: Song[]) => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select songs to add mood",
        variant: "destructive",
      });
      return;
    }
    setIsMoodDialogOpen(true);
  };

  const handleMoodConfirm = (moodId: number) => {
    toast({
      title: "Success",
      description: "Mood updated successfully",
    });
    setIsMoodDialogOpen(false);
  };

  return {
    isMoodDialogOpen,
    setIsMoodDialogOpen,
    handleAddMood,
    handleMoodConfirm
  };
};