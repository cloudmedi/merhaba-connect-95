import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useToast } from "@/hooks/use-toast";
import { useMusicLibrary } from "./hooks/useMusicLibrary";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    songs,
    isLoading,
    filterGenre,
    setFilterGenre,
    sortByRecent,
    setSortByRecent,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalCount,
    refetch,
    genres
  } = useMusicLibrary();

  const handleSelectAll = (checked: boolean) => {
    setSelectedSongs(checked ? songs : []);
  };

  const handleSelectSong = (song: any, checked: boolean) => {
    if (checked) {
      setSelectedSongs(prev => [...prev, song]);
    } else {
      setSelectedSongs(prev => prev.filter(s => s.id !== song.id));
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Song deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete song",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .in('id', selectedSongs.map(song => song.id));

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedSongs.length} songs have been deleted`,
      });

      setSelectedSongs([]);
      refetch();
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
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        onGenreChange={(genre) => setFilterGenre(genre)}
        onRecentChange={(recent) => setSortByRecent(recent)}
        onSearchChange={setSearchQuery}
        genres={genres}
        searchQuery={searchQuery}
      />
      
      <MusicTable
        songs={filteredSongs}
        selectedSongs={selectedSongs}
        onSelectAll={handleSelectAll}
        onSelectSong={handleSelectSong}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
        totalCount={totalCount}
        onDelete={handleDeleteSong}
      />
    </div>
  );
}