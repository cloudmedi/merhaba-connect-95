import { useState } from "react";
import { MusicHeader } from "./MusicHeader";
import { MusicActions } from "./MusicActions";
import { MusicTable } from "./MusicTable";
import { MusicFilters } from "./MusicFilters";
import { useToast } from "@/hooks/use-toast";
import { MusicPlayer } from "@/components/MusicPlayer";

// Mock data
const mockSongs = [
  {
    id: "1",
    title: "Summer Vibes",
    artist: "John Doe",
    album: "Summer Collection",
    genre: ["Pop", "Electronic"],
    duration: 180,
    artwork_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Midnight Jazz",
    artist: "Sarah Smith",
    album: "Jazz Sessions",
    genre: ["Jazz"],
    duration: 240,
    artwork_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    created_at: new Date().toISOString()
  },
  // Add more mock songs as needed
];

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<typeof mockSongs[0][]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<typeof mockSongs[0] | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    toast({
      title: "Upload Successful",
      description: `${files.length} songs have been uploaded`,
    });
  };

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
    setCurrentlyPlaying(song);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <MusicHeader onUpload={handleFileUpload} />
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
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        itemsPerPage={10}
        onPlaySong={handlePlaySong}
        isLoading={false}
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
                file_url: "/mock-audio.mp3"
              }]
            }}
            onClose={() => setCurrentlyPlaying(null)}
          />
        </div>
      )}
    </div>
  );
}