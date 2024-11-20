import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";

interface PlaylistItem {
  id: number;
  title: string;
  genre: string;
  mood: string;
  image: string;
}

const playlists: PlaylistItem[] = [
  {
    id: 1,
    title: "Summer Vibes 2024",
    genre: "Pop",
    mood: "Energetic",
    image: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png"
  },
  {
    id: 2,
    title: "Relaxing Jazz",
    genre: "Jazz",
    mood: "Calm",
    image: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    id: 3,
    title: "Coffee Shop Ambience",
    genre: "Ambient",
    mood: "Relaxed",
    image: "/lovable-uploads/db3fbe19-e5ea-4571-b9be-e6e5f633c112.png"
  }
];

const PlaylistGrid = ({ title, description }: { title: string; description?: string }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistItem | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <Card 
            key={playlist.id} 
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-none"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={playlist.image}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <button
                  onClick={() => setCurrentPlaylist(playlist)}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-base text-gray-900 truncate">{playlist.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{playlist.genre}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-sm text-gray-600">{playlist.mood}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {currentPlaylist && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.image
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
};

export default function ManagerDashboard() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Assigned Playlists</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-12">
        <PlaylistGrid 
          title="Business Hours" 
          description="Active during business hours" 
        />
        
        <PlaylistGrid 
          title="Evening Ambience" 
          description="Perfect for evening atmosphere" 
        />
        
        <PlaylistGrid 
          title="Weekend Selection" 
          description="Special weekend playlists" 
        />
      </div>
    </div>
  );
}