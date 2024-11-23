import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongList } from "@/components/playlists/SongList";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Mock data - replace with actual data fetching
  const playlist = {
    id,
    title: "Summer Vibes 2024",
    genre: "Pop",
    mood: "Energetic",
    songCount: "45 songs",
    duration: "2h 45m",
    artwork: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
    songs: Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      title: `Song Title ${i + 1}`,
      artist: `Artist ${Math.floor(i / 8) + 1}`,
      duration: "3:30",
      file_url: `/mock-songs/song-${i + 1}.mp3`
    }))
  };

  const handleSongSelect = (song: any) => {
    const songIndex = playlist.songs.findIndex((s: any) => s.id === song.id);
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  };

  const handleCurrentSongIndexChange = (index: number) => {
    setCurrentSongIndex(index);
  };

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2 text-gray-500">
          <button 
            onClick={() => navigate("/manager/playlists")}
            className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Media Library
          </button>
        </div>

        <div className="flex items-start gap-8">
          <div className="relative group">
            <img 
              src={playlist.artwork} 
              alt={playlist.title}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transform"
              >
                <Play className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-gray-900">{playlist.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{playlist.genre}</span>
              <span>•</span>
              <span>{playlist.mood}</span>
              <span>•</span>
              <span>{playlist.songCount}</span>
              <span>•</span>
              <span>{playlist.duration}</span>
            </div>
            <Button 
              onClick={() => setIsPushDialogOpen(true)}
              className="bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-full px-8"
            >
              Push
            </Button>
          </div>
        </div>

        <SongList 
          songs={playlist.songs}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          onCurrentSongIndexChange={handleCurrentSongIndexChange}
        />
      </div>

      <PushPlaylistDialog
        isOpen={isPushDialogOpen}
        onClose={() => setIsPushDialogOpen(false)}
        playlistTitle={playlist.title}
      />

      {isPlaying && (
        <MusicPlayer
          playlist={{
            title: playlist.title,
            artwork: playlist.artwork,
            songs: playlist.songs
          }}
          onClose={() => setIsPlaying(false)}
          initialSongIndex={currentSongIndex}
          onSongChange={handleCurrentSongIndexChange}
          autoPlay={true}
        />
      )}
    </div>
  );
}