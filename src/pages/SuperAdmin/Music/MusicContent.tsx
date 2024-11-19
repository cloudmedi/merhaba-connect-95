import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./components/MusicFilters";
import { GenreChangeDialog } from "./components/GenreChangeDialog";
import { AddGenreDialog } from "./components/AddGenreDialog";
import { PlaylistDialog } from "./components/PlaylistDialog";
import { MoodDialog } from "./components/MoodDialog";
import { useMusicActions } from "./hooks/useMusicActions";
import { usePlaylistActions } from "./hooks/usePlaylistActions";
import { useMoodActions } from "./hooks/useMoodActions";
import { MusicPlayer } from "@/components/MusicPlayer";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  duration: string;
  file: File;
  artwork?: string;
  uploadDate: Date;
  playlists?: string[];
  mood?: string;
  uploader?: string;
}

export function MusicContent() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [filters, setFilters] = useState({
    artists: [],
    albums: [],
    uploaders: [],
    genre: "",
    mood: "",
  });

  const itemsPerPage = 100;
  const { toast } = useToast();

  const {
    isGenreDialogOpen,
    setIsGenreDialogOpen,
    isAddGenreDialogOpen,
    setIsAddGenreDialogOpen,
    handleGenreChange,
    handleAddGenre,
    handleGenreConfirm,
    handleAddGenreConfirm
  } = useMusicActions(songs, setSongs);

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

  const filteredSongs = songs.filter(song => {
    if (filters.artists.length && !filters.artists.includes(song.artist)) return false;
    if (filters.albums.length && !filters.albums.includes(song.album)) return false;
    if (filters.uploaders.length && !filters.uploaders.includes(song.uploader || "")) return false;
    if (filters.genre && !song.genres.includes(filters.genre)) return false;
    if (filters.mood && song.mood !== filters.mood) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = [];

    for (const file of Array.from(files)) {
      try {
        const metadata = await musicMetadata.parseBlob(file);
        newSongs.push({
          id: Date.now() + newSongs.length,
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: metadata.common.artist || "Unknown Artist",
          album: metadata.common.album || "Unknown Album",
          genres: metadata.common.genre || [],
          duration: formatDuration(metadata.format.duration || 0),
          file: file,
          uploadDate: new Date(),
          playlists: [],
          artwork: metadata.common.picture?.[0] ? 
            URL.createObjectURL(new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format })) :
            undefined
        });
      } catch (error) {
        console.error("Error parsing metadata:", error);
        newSongs.push({
          id: Date.now() + newSongs.length,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          album: "Unknown Album",
          genres: [],
          duration: "0:00",
          file: file,
          uploadDate: new Date(),
          playlists: [],
        });
      }
    }

    setSongs((prev) => [...prev, ...newSongs]);
    toast({
      title: "Success",
      description: `${files.length} songs uploaded successfully`,
    });
  };

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

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-8">
        <div className="w-80 sticky top-4">
          <MusicFilters onFilterChange={setFilters} />
        </div>
        
        <div className="flex-1 space-y-8">
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
