import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";

interface Playlist {
  id: number;
  title: string;
  genre: string;
  mood: string;
  artwork: string;
}

const playlists: Playlist[] = [
  {
    id: 1,
    title: "Summer Vibes 2024",
    genre: "Pop",
    mood: "Energetic",
    artwork: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png"
  },
  {
    id: 2,
    title: "Relaxing Jazz",
    genre: "Jazz",
    mood: "Calm",
    artwork: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    id: 3,
    title: "Coffee Shop Ambience",
    genre: "Ambient",
    mood: "Relaxed",
    artwork: "/lovable-uploads/db3fbe19-e5ea-4571-b9be-e6e5f633c112.png"
  }
];

const PlaylistGrid = ({ title, description }: { title: string; description?: string }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={playlist.artwork}
                alt={playlist.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                <button
                  onClick={() => setCurrentPlaylist(playlist)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 transform"
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
              <h3 className="font-medium text-base text-gray-900">{playlist.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {playlist.genre}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {playlist.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentPlaylist && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Playlists</h1>
          <p className="text-gray-500 mt-1">Manage your business music playlists</p>
        </div>
        <div className="relative w-full sm:w-64">
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