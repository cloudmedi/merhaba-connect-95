import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Song } from "./useMusicLibrary";

export const useMusicActions = (songs: Song[], setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
  const { toast } = useToast();
  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false);
  const [isAddGenreDialogOpen, setIsAddGenreDialogOpen] = useState(false);

  const handleAddPlaylist = () => {
    toast({
      title: "Success",
      description: "Playlist added successfully",
    });
  };

  const handleChangeMood = () => {
    toast({
      title: "Success",
      description: "Mood changed successfully",
    });
  };

  const handleGenreChange = (selectedSongs: Song[]) => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select songs to change their genre",
        variant: "destructive",
      });
      return;
    }
    setIsGenreDialogOpen(true);
  };

  const handleAddGenre = (selectedSongs: Song[]) => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select songs to add genres",
        variant: "destructive",
      });
      return;
    }
    setIsAddGenreDialogOpen(true);
  };

  const genreMap: Record<number, string> = {
    1: "Rock",
    2: "Pop",
    3: "Jazz",
    4: "Classical",
    5: "Hip Hop",
    6: "Electronic",
    7: "R&B",
    8: "Country",
    9: "Blues",
    10: "Folk",
  };

  const handleGenreConfirm = (genreId: number, selectedSongs: Song[]) => {
    setSongs(prev => 
      prev.map(song => 
        selectedSongs.some(s => s.id === song.id)
          ? { ...song, genre: [genreMap[genreId]] }
          : song
      )
    );
    
    setIsGenreDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Genre updated to ${genreMap[genreId]} for ${selectedSongs.length} songs`,
    });
  };

  const handleAddGenreConfirm = (genreIds: number[], selectedSongs: Song[]) => {
    setSongs(prev => 
      prev.map(song => {
        if (selectedSongs.some(s => s.id === song.id)) {
          const newGenres = [...new Set([...(song.genre || []), ...genreIds.map(id => genreMap[id])])];
          return { ...song, genre: newGenres };
        }
        return song;
      })
    );
    
    setIsAddGenreDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Genres added to ${selectedSongs.length} songs`,
    });
  };

  return {
    isGenreDialogOpen,
    setIsGenreDialogOpen,
    isAddGenreDialogOpen,
    setIsAddGenreDialogOpen,
    handleAddPlaylist,
    handleChangeMood,
    handleGenreChange,
    handleAddGenre,
    handleGenreConfirm,
    handleAddGenreConfirm
  };
};