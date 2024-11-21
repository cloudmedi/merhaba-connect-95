import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockSongs = [
  {
    id: "1",
    title: "Summer Vibes",
    artist: "John Doe",
    album: "Summer Collection",
    genre: ["Pop", "Electronic"],
    duration: 180,
    artwork_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
  },
  {
    id: "2",
    title: "Midnight Jazz",
    artist: "Sarah Smith",
    album: "Jazz Sessions",
    genre: ["Jazz"],
    duration: 240,
    artwork_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
  },
];

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<typeof mockSongs[0][]>([]);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    setSelectedSongs(checked ? mockSongs : []);
  };

  const handleSelectSong = (song: typeof mockSongs[0], checked: boolean) => {
    if (checked) {
      setSelectedSongs(prev => [...prev, song]);
    } else {
      setSelectedSongs(prev => prev.filter(s => s.id !== song.id));
    }
  };

  const handlePlaySong = (song: typeof mockSongs[0]) => {
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen animate-fade-in">
      <MusicHeader />
      
      <div className="space-y-4">
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
          />
        )}
        
        <MusicFilters
          onGenreChange={() => {}}
          onPlaylistChange={() => {}}
          onRecentChange={() => {}}
          genres={Array.from(new Set(mockSongs.flatMap(song => song.genre || [])))}
          playlists={[]}
        />
        
        <MusicTable
          songs={mockSongs}
          selectedSongs={selectedSongs}
          onSelectAll={handleSelectAll}
          onSelectSong={handleSelectSong}
          onPlaySong={handlePlaySong}
          isLoading={false}
        />
      </div>
    </div>
  );
}