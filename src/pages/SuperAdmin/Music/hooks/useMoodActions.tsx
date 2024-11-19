import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useMoodActions = () => {
  const [isMoodDialogOpen, setIsMoodDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddMood = (selectedSongs: any[]) => {
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

  return {
    isMoodDialogOpen,
    setIsMoodDialogOpen,
    handleAddMood,
  };
};