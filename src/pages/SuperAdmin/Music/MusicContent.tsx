import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import * as musicMetadata from 'music-metadata-browser';
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";

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
}

export function MusicContent() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [filterGenre, setFilterGenre] = useState<string>("all-genres");
  const [filterPlaylist, setFilterPlaylist] = useState<string>("all-playlists");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Changed from 9 to 100
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleCreatePlaylist = () => {
    navigate("/super-admin/playlists/create", {
      state: { selectedSongs },
    });
  };

  const handleDeleteSelected = () => {
    setSongs((prev) =>
      prev.filter((song) => !selectedSongs.some((s) => s.id === song.id))
    );
    setSelectedSongs([]);
    toast({
      title: "Success",
      description: "Selected songs deleted successfully",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader onUpload={handleFileUpload} />
        {selectedSongs.length > 0 && (
          <div className="flex gap-4">
            <MusicActions
              selectedCount={selectedSongs.length}
              onCreatePlaylist={handleCreatePlaylist}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
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
        songs={filteredSongs}
        selectedSongs={selectedSongs}
        onSelectAll={handleSelectAll}
        onSelectSong={handleSelectSong}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}