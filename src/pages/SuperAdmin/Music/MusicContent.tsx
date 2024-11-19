import { useState } from "react";
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
import { MusicPlayer } from "@/components/MusicPlayer";
import { useFileUpload } from "./hooks/useFileUpload";
import { Song, Filters } from "./types";

export function MusicContent() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [filters, setFilters] = useState<Filters>({
    artists: [],
    albums: [],
    uploaders: [],
    genre: "",
    mood: "",
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<string[]>([]);

  const itemsPerPage = 10; // Changed to 10 to match the design

  const { handleFileUpload } = useFileUpload(setSongs);

  const {
    isGenreDialogOpen,
    setIsGenreDialogOpen,
    isAddGenreDialogOpen,
    setIsAddGenreDialogOpen,
    handleGenreDialogChange,
    handleAddGenre,
    handleGenreConfirm,
    handleAddGenreConfirm
  } = useMusicActions(songs, setSongs);

  const {
    isPlaylistDialogOpen,
    setIsPlaylistDialogOpen,
    handleAddToPlaylist,
    handlePlaylistConfirm
  } = usePlaylistActions();

  const {
    isMoodDialogOpen,
    setIsMoodDialogOpen,
    handleAddMood,
    handleMoodConfirm
  } = useMoodActions();

  const filteredSongs = songs.filter(song => {
    if (filters.artists.length && !filters.artists.includes(song.artist)) return false;
    if (filters.albums.length && !filters.albums.includes(song.album)) return false;
    if (filters.uploaders.length && !filters.uploaders.includes(song.uploader || "")) return false;
    if (filters.genre && !song.genres.includes(filters.genre)) return false;
    if (filters.mood && song.mood !== filters.mood) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSongs(filteredSongs);
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

  const handleGenreChange = (genre: string) => {
    setFilters(prev => ({ ...prev, genre }));
  };

  const handlePlaylistChange = (playlist: string) => {
    // Handle playlist change
  };

  const handleRecentChange = (recent: boolean) => {
    // Handle recent change
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-64">
          <MusicFilters 
            genres={genres}
            playlists={playlists}
            onGenreChange={handleGenreChange}
            onPlaylistChange={handlePlaylistChange}
            onRecentChange={handleRecentChange}
            onFilterChange={setFilters}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <MusicHeader onUpload={handleFileUpload} />
            {selectedSongs.length > 0 && (
              <MusicActions
                selectedCount={selectedSongs.length}
                onCreatePlaylist={() => handleAddToPlaylist(selectedSongs)}
                onDeleteSelected={() => {/* Implement delete action */}}
                onAddGenre={() => handleAddGenre(selectedSongs)}
                onChangeGenre={() => handleGenreDialogChange(selectedSongs)}
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
          
          <MusicTable
            songs={filteredSongs}
            selectedSongs={selectedSongs}
            onSelectAll={handleSelectAll}
            onSelectSong={handleSelectSong}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onPlaySong={handlePlaySong}
          />
        </div>
      </div>

      {currentlyPlaying && (
        <MusicPlayer
          playlist={{
            title: `${currentlyPlaying.title} - ${currentlyPlaying.artist}`,
            artwork: currentlyPlaying.artwork || "/placeholder.svg"
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
        onConfirm={handlePlaylistConfirm}
      />

      <MoodDialog
        isOpen={isMoodDialogOpen}
        onClose={() => setIsMoodDialogOpen(false)}
        onConfirm={handleMoodConfirm}
      />
    </div>
  );
}