import { useState } from "react";
import { MusicFilters } from "./components/MusicFilters";
import { MusicTable } from "./components/MusicTable";
import { useMusicLibrary } from "./hooks/useMusicLibrary";

export function MusicContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  
  const {
    songs,
    isLoading,
    genres,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch
  } = useMusicLibrary();

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.album?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === "all" || 
                        song.genre?.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  const handleSelectAll = () => {
    if (selectedSongs.length > 0) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(filteredSongs.map(song => song.id));
    }
  };

  return (
    <div className="space-y-6">
      <MusicFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        genres={genres}
        onSelectAll={handleSelectAll}
        selectedCount={selectedSongs.length}
      />
      
      <MusicTable
        songs={filteredSongs}
        isLoading={isLoading}
        selectedSongs={selectedSongs}
        onSongSelect={(id) => {
          if (selectedSongs.includes(id)) {
            setSelectedSongs(selectedSongs.filter(songId => songId !== id));
          } else {
            setSelectedSongs([...selectedSongs, id]);
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRefresh={refetch}
      />
    </div>
  );
}