import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
      duration: "3:30"
    }))
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

        <div className="mt-12">
          <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider pb-4 border-b">
            <div className="col-span-1">#</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-4">ARTIST</div>
            <div className="col-span-2 text-right">DURATION</div>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            {playlist.songs.map((song, index) => (
              <div 
                key={song.id}
                className="grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100"
              >
                <div className="col-span-1 text-gray-400">{index + 1}</div>
                <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-gray-400" />
                  {song.title}
                </div>
                <div className="col-span-4 text-gray-500">{song.artist}</div>
                <div className="col-span-2 text-right text-gray-500">{song.duration}</div>
              </div>
            ))}
          </ScrollArea>
        </div>
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
        />
      )}
    </div>
  );
}