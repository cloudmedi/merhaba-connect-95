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
import * as musicMetadata from 'music-metadata-browser';

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

export function MusicContent() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [filterGenre, setFilterGenre] = useState<string>("all-genres");
  const [filterPlaylist, setFilterPlaylist] = useState<string>("all-playlists");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  const handlePlaylistConfirm = (playlistIds: number[]) => {
    setSongs(prev => 
      prev.map(song => 
        selectedSongs.some(s => s.id === song.id)
          ? { ...song, playlists: [...(song.playlists || []), ...playlistIds.map(String)] }
          : song
      )
    );
    
    toast({
      title: "Success",
      description: `Songs added to ${playlistIds.length} playlists`,
    });
  };

  const handleMoodConfirm = (moodId: number) => {
    const moodMap: Record<number, string> = {
      1: "Happy",
      2: "Sad",
      3: "Energetic",
      4: "Calm",
      5: "Romantic",
    };

    setSongs(prev => 
      prev.map(song => 
        selectedSongs.some(s => s.id === song.id)
          ? { ...song, mood: moodMap[moodId] }
          : song
      )
    );
    
    toast({
      title: "Success",
      description: `Mood updated to ${moodMap[moodId]} for ${selectedSongs.length} songs`,
    });
  };

  const filteredSongs = songs
    .filter(song => {
      if (filterGenre !== "all-genres" && !song.genres.includes(filterGenre)) return false;
      if (filterPlaylist !== "all-playlists" && !song.playlists?.includes(filterPlaylist)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortByRecent) {
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      }
      return 0;
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader onUpload={handleFileUpload} />
        {selectedSongs.length > 0 && (
          <MusicActions
            selectedCount={selectedSongs.length}
            onAddGenre={() => handleAddGenre(selectedSongs)}
            onChangeGenre={() => handleGenreChange(selectedSongs)}
            onAddPlaylist={() => handleAddToPlaylist(selectedSongs)}
            onChangePlaylist={() => handleAddToPlaylist(selectedSongs)}
            onAddMood={() => handleAddMood(selectedSongs)}
            onChangeMood={() => handleAddMood(selectedSongs)}
            onChangeArtist={() => {/* Implement artist change */}}
            onChangeAlbum={() => {/* Implement album change */}}
            onApprove={() => {/* Implement approve action */}}
            onDeleteSelected={() => {/* Implement delete action */}}
          />
        )}
      </div>
      
      <MusicFilters
        onGenreChange={setFilterGenre}
        onPlaylistChange={setFilterPlaylist}
        onRecentChange={setSortByRecent}
        genres={Array.from(new Set(songs.flatMap(song => song.genres)))}
        playlists={Array.from(new Set(songs.flatMap(song => song.playlists || [])))}
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
      />

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
