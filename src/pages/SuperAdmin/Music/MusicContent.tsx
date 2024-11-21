import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useToast } from "@/hooks/use-toast";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useMusicLibrary } from "./hooks/useMusicLibrary";

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any | null>(null);
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

  const handlePlaySong = (song: any) => {
    setCurrentlyPlaying(song);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist || 'Unknown Artist'}`,
    });
  };

  // Get unique genres from songs
  const uniqueGenres = Array.from(new Set(songs.flatMap(song => song.genre || [])));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader />
        {selectedSongs.length > 0 && (
          <MusicActions
            selectedCount={selectedSongs.length}
            onCreatePlaylist={() => {
              toast({
                title: "Playlist Created",
                description: `Created playlist with ${selectedSongs.length} songs`,
              });
            }}
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
        genres={uniqueGenres}
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
        onPlaySong={handlePlaySong}
        isLoading={isLoading}
      />

      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg animate-slide-in-up">
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
        </div>
      )}
    </div>
  );
}