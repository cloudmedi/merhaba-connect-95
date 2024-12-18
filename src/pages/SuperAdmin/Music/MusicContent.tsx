import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from '@/lib/axios';

export interface Song {
  _id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  fileUrl: string;
  artworkUrl?: string;
  createdAt: string;
}

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: songs = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const response = await axios.get('/admin/songs');
      return response.data as Song[];
    }
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedSongs(checked ? songs : []);
  };

  const handleSelectSong = (song: Song, checked: boolean) => {
    if (checked) {
      setSelectedSongs(prev => [...prev, song]);
    } else {
      setSelectedSongs(prev => prev.filter(s => s._id !== song._id));
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      if (!songId) {
        toast({
          title: "Error",
          description: "Invalid song ID",
          variant: "destructive",
        });
        return;
      }

      await axios.delete(`/admin/songs/${songId}`);

      toast({
        title: "Success",
        description: "Song deleted successfully",
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting song:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete song",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const song of selectedSongs) {
        await handleDeleteSong(song._id);
      }
      setSelectedSongs([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete songs",
        variant: "destructive",
      });
    }
  };

  const handleCreatePlaylist = () => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select at least one song to create a playlist",
        variant: "destructive"
      });
      return;
    }

    navigate("/super-admin/playlists/create", {
      state: { selectedSongs }
    });
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (song.artist?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (song.album?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Extract unique genres from songs
  const genres = Array.from(new Set(
    songs.reduce((acc: string[], song) => {
      if (song.genre && Array.isArray(song.genre)) {
        return [...acc, ...song.genre];
      }
      return acc;
    }, [])
  )).sort();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader />
        <div className="flex items-center gap-2">
          {selectedSongs.length > 0 && (
            <>
              <Button 
                onClick={handleCreatePlaylist}
                className="whitespace-nowrap"
              >
                Create Playlist ({selectedSongs.length} songs)
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleBulkDelete}
                className="whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedSongs.length})
              </Button>
            </>
          )}
        </div>
      </div>
      
      <MusicFilters
        onGenreChange={() => {}}
        onRecentChange={() => {}}
        onSearchChange={setSearchQuery}
        genres={genres}
        searchQuery={searchQuery}
      />
      
      <MusicTable
        songs={filteredSongs}
        selectedSongs={selectedSongs}
        onSelectAll={handleSelectAll}
        onSelectSong={handleSelectSong}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        itemsPerPage={20}
        isLoading={isLoading}
        totalCount={filteredSongs.length}
        onDelete={handleDeleteSong}
      />
    </div>
  );
}