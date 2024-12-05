import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useToast } from "@/hooks/use-toast";
import { useMusicLibrary } from "./hooks/useMusicLibrary";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    songs,
    isLoading,
    filterGenre,
    setFilterGenre,
    filterPlaylist,
    setFilterPlaylist,
    sortByRecent,
    setSortByRecent,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalCount,
    refetch
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader />
        {selectedSongs.length > 0 && (
          <MusicActions
            selectedCount={selectedSongs.length}
            onCreatePlaylist={handleCreatePlaylist}
            onDeleteSelected={() => {
              toast({
                title: "Songs Deleted",
                description: `${selectedSongs.length} songs have been deleted`,
              });
              setSelectedSongs([]);
            }}
            onAddGenre={() => {}}
            onChangeGenre={() => {}}
            onAddPlaylist={() => {}}
            onChangePlaylist={() => {}}
            onAddMood={() => {}}
            onChangeMood={() => {}}
            onChangeArtist={() => {}}
            onChangeAlbum={() => {}}
            onApprove={() => {}}
          />
        )}
      </div>
      
      <MusicFilters
        onGenreChange={(genre) => setFilterGenre(genre)}
        onPlaylistChange={(playlist) => setFilterPlaylist(playlist)}
        onRecentChange={(recent) => setSortByRecent(recent)}
        genres={[]}
        playlists={[]}
      />
      
      <MusicTable
        songs={songs}
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