import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  duration: string;
  file: File;
  uploadDate: Date;
  playlists?: string[];
  mood?: string;
}

export const useMusicActions = (songs: Song[], setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
  const { toast } = useToast();
  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false);

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

  const handleGenreConfirm = (genreId: number, selectedSongs: Song[]) => {
    const genreMap: Record<number, string> = {
      1: "Rock",
      2: "Pop",
      3: "Jazz",
      4: "Classical",
      5: "Hip Hop",
      6: "Electronic",
    };

    setSongs(prev => 
      prev.map(song => 
        selectedSongs.some(s => s.id === song.id)
          ? { ...song, genres: [genreMap[genreId]] }
          : song
      )
    );
    
    setIsGenreDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Genre updated to ${genreMap[genreId]} for ${selectedSongs.length} songs`,
    });
  };

  return {
    isGenreDialogOpen,
    setIsGenreDialogOpen,
    handleAddPlaylist,
    handleChangeMood,
    handleGenreChange,
    handleGenreConfirm
  };
};