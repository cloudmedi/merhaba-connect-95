import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function PlaylistDetail() {
  const { id } = useParams();

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
      artist: `Artist ${Math.floor(i / 5) + 1}`,
      duration: "3:30"
    }))
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link 
          to="/player/playlists" 
          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Media Library
        </Link>
      </div>

      <div className="flex items-start gap-8">
        <img 
          src={playlist.artwork} 
          alt={playlist.title}
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Badge variant="secondary">{playlist.genre}</Badge>
            <Badge variant="secondary">{playlist.mood}</Badge>
            <span>•</span>
            <span>{playlist.songCount}</span>
            <span>•</span>
            <span>{playlist.duration}</span>
          </div>
          <Button className="bg-[#6366F1] text-white hover:bg-[#5558DD]">
            <Play className="w-4 h-4 mr-2" />
            Push
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b pb-4">
          <div className="grid grid-cols-12 text-sm text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-4">ARTIST</div>
            <div className="col-span-2 text-right">DURATION</div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-400px)]">
          {playlist.songs.map((song, index) => (
            <div 
              key={song.id}
              className="grid grid-cols-12 py-3 text-sm hover:bg-gray-50 transition-colors items-center"
            >
              <div className="col-span-1 text-gray-500">{index + 1}</div>
              <div className="col-span-5 font-medium">{song.title}</div>
              <div className="col-span-4 text-gray-600">{song.artist}</div>
              <div className="col-span-2 text-right text-gray-600">{song.duration}</div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}