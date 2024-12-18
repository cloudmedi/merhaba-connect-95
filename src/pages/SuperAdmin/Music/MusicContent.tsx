import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from '@/lib/axios';
import { toast } from "sonner";

export interface Song {
  _id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  fileUrl: string;
  file_url: string; // Added for compatibility
  artworkUrl?: string;
  createdAt: string;
  bunnyId?: string;
  createdBy?: string;
  updatedAt?: string;
}

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const {
    data: songs = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const response = await axios.get('/admin/songs');
      // Transform the response to include both fileUrl and file_url
      return response.data.map((song: any) => ({
        ...song,
        file_url: song.fileUrl // Ensure both properties exist
      }));
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
      await axios.delete(`/admin/songs/${songId}`);
      toast.success("Song deleted successfully");
      refetch();
    } catch (error: any) {
      console.error('Error deleting song:', error);
      toast.error(error.message || "Failed to delete song");
    }
  };

  const handleEditSong = (song: Song) => {
    toast.info("Edit functionality coming soon");
  };

  const handleBulkDelete = async () => {
    try {
      for (const song of selectedSongs) {
        await handleDeleteSong(song._id);
      }
      setSelectedSongs([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete songs");
    }
  };

  const handleCreatePlaylist = () => {
    if (selectedSongs.length === 0) {
      toast.error("Please select at least one song to create a playlist");
      return;
    }

    navigate("/super-admin/playlists/create", {
      state: { selectedSongs }
    });
  };

  const filteredSongs = songs.filter((song: Song) => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (song.artist?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (song.album?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Fixed the type inference for genres extraction with explicit typing
  const genres = Array.from(new Set(
    filteredSongs.reduce<string[]>((acc, song: Song) => {
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
        onEdit={handleEditSong}
      />
    </div>
  );
}