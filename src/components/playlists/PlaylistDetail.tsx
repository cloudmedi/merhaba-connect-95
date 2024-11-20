import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PlaylistDetail() {
  const { id } = useParams();

  // Mock data - replace with actual data fetching
  const playlist = {
    id,
    title: "Summer Vibes 2024",
    artwork: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
    songs: Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      title: `Song Title ${i + 1}`,
      artist: `Artist ${Math.floor(i / 5) + 1}`,
      duration: "3:30"
    }))
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-start gap-8">
        <img 
          src={playlist.artwork} 
          alt={playlist.title}
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
            <Play className="w-4 h-4 mr-2" />
            Play All
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left w-16">#</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Artist</th>
                <th className="py-3 px-4 text-right">
                  <Clock className="w-4 h-4 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {playlist.songs.map((song, index) => (
                <tr 
                  key={song.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{song.title}</td>
                  <td className="py-3 px-4 text-gray-600">{song.artist}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{song.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}