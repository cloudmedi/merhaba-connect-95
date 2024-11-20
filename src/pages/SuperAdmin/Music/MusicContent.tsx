import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { GenreChangeDialog } from "./components/GenreChangeDialog";
import { AddGenreDialog } from "./components/AddGenreDialog";
import { PlaylistDialog } from "./components/PlaylistDialog";
import { MoodDialog } from "./components/MoodDialog";
import { useMusicActions } from "./hooks/useMusicActions";
import { usePlaylistActions } from "./hooks/usePlaylistActions";
import { useMoodActions } from "./hooks/useMoodActions";
import { useMusicLibrary, type Song } from "./hooks/useMusicLibrary";
import { MusicPlayer } from "@/components/MusicPlayer";

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const { toast } = useToast();

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
    itemsPerPage
  } = useMusicLibrary();

  const {
    isGenreDialogOpen,
    setIsGenreDialogOpen,
    isAddGenreDialogOpen,
    setIsAddGenreDialogOpen,
    handleGenreChange,
    handleAddGenre,
    handleGenreConfirm,
    handleAddGenreConfirm
  } = useMusicActions(songs, () => {});

  const {
    isPlaylistDialogOpen,
    setIsPlaylistDialogOpen,
    handleAddToPlaylist
  } = usePlaylistActions();

  const {
    isMoodDialogOpen,
    setIsMoodDialogOpen,
    handleAddMood
  } = useMoodActions();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSongs(songs);
    } else {
      setSelectedSongs([]);
    }
  };

  const handleSelectSong = (song: Song, checked: boolean) => {
    if (checked) {
      setSelectedSongs((prev) => [...prev, song]);
    } else {
      setSelectedSongs((prev) => prev.filter((s) => s.id !== song.id));
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentlyPlaying(song);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    toast({
      title: "Success",
      description: `${files.length} songs uploaded successfully`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader onUpload={handleFileUpload} />
        {selectedSongs.length > 0 && (
          <MusicActions
            selectedCount={selectedSongs.length}
            onCreatePlaylist={() => handleAddToPlaylist(selectedSongs)}
            onDeleteSelected={() => {/* Implement delete action */}}
            onAddGenre={() => handleAddGenre(selectedSongs)}
            onChangeGenre={() => handleGenreChange(selectedSongs)}
            onAddPlaylist={() => handleAddToPlaylist(selectedSongs)}
            onChangePlaylist={() => handleAddToPlaylist(selectedSongs)}
            onAddMood={() => handleAddMood(selectedSongs)}
            onChangeMood={() => handleAddMood(selectedSongs)}
            onChangeArtist={() => {/* Implement artist change */}}
            onChangeAlbum={() => {/* Implement album change */}}
            onApprove={() => {/* Implement approve action */}}
          />
        )}
      </div>
      
      <MusicFilters
        onGenreChange={setFilterGenre}
        onPlaylistChange={setFilterPlaylist}
        onRecentChange={setSortByRecent}
        genres={Array.from(new Set(songs.flatMap(song => song.genre || [])))}
        playlists={[]} // We'll implement this later
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
        onPlaySong={handlePlaySong}
        isLoading={isLoading}
      />

      {currentlyPlaying && (
        <MusicPlayer
          playlist={{
            title: currentlyPlaying.title,
            artwork: currentlyPlaying.artwork_url || "/placeholder.svg",
            songs: [{
              id: parseInt(currentlyPlaying.id),
              title: currentlyPlaying.title,
              artist: currentlyPlaying.artist || "Unknown Artist",
              duration: currentlyPlaying.duration?.toString() || "0:00",
              file_url: currentlyPlaying.file_url
            }]
          }}
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}

      <GenreChangeDialog 
        isOpen={isGenreDialogOpen}
        onClose={() => setIsGenreDialogOpen(false)}
        onConfirm={(genreId) => handleGenreConfirm(genreId, selectedSongs)}
      />

      <AddGenreDialog
        isOpen={isAddGenreDialogOpen}
        onClose={() => setIsAddGenreDialogOpen(false)}
        onConfirm={(genreIds) => handleAddGenreConfirm(genreIds, selectedSongs)}
      />

      <PlaylistDialog
        isOpen={isPlaylistDialogOpen}
        onClose={() => setIsPlaylistDialogOpen(false)}
        onConfirm={() => {}} // We'll implement this later
      />

      <MoodDialog
        isOpen={isMoodDialogOpen}
        onClose={() => setIsMoodDialogOpen(false)}
        onConfirm={() => {}} // We'll implement this later
      />
    </div>
  );
}