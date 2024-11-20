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

const businessHoursPlaylists: Playlist[] = [
  {
    id: 1,
    title: "Morning Coffee Shop",
    genre: "Jazz",
    mood: "Calm",
    artwork: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800"
  },
  {
    id: 2,
    title: "Lunch Break Vibes",
    genre: "Pop",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
  },
  {
    id: 3,
    title: "Afternoon Chill",
    genre: "Lo-Fi",
    mood: "Relaxed",
    artwork: "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=800"
  },
  {
    id: 4,
    title: "Productive Hours",
    genre: "Instrumental",
    mood: "Focused",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800"
  },
  {
    id: 5,
    title: "Business Ambience",
    genre: "Ambient",
    mood: "Neutral",
    artwork: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800"
  },
  {
    id: 6,
    title: "Office Energy",
    genre: "Electronic",
    mood: "Upbeat",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
  },
  {
    id: 7,
    title: "Morning Motivation",
    genre: "Pop",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"
  },
  {
    id: 8,
    title: "Work Flow",
    genre: "Electronic",
    mood: "Focused",
    artwork: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
  }
];

const eveningPlaylists: Playlist[] = [
  {
    id: 9,
    title: "Sunset Lounge",
    genre: "Deep House",
    mood: "Relaxed",
    artwork: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=800"
  },
  {
    id: 10,
    title: "Evening Jazz",
    genre: "Jazz",
    mood: "Sophisticated",
    artwork: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800"
  },
  {
    id: 11,
    title: "Night Vibes",
    genre: "Electronic",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
  },
  {
    id: 12,
    title: "Dinner Time",
    genre: "Classical",
    mood: "Elegant",
    artwork: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
  },
  {
    id: 13,
    title: "Late Night Mood",
    genre: "Soul",
    mood: "Romantic",
    artwork: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800"
  },
  {
    id: 14,
    title: "Closing Hours",
    genre: "Ambient",
    mood: "Calm",
    artwork: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800"
  },
  {
    id: 15,
    title: "Evening Elegance",
    genre: "Classical",
    mood: "Sophisticated",
    artwork: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800"
  },
  {
    id: 16,
    title: "Night Club",
    genre: "House",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-15767442549210-869c28713e42?w=800"
  }
];

const weekendPlaylists: Playlist[] = [
  {
    id: 17,
    title: "Weekend Brunch",
    genre: "Pop",
    mood: "Happy",
    artwork: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: 18,
    title: "Saturday Vibes",
    genre: "House",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
  },
  {
    id: 19,
    title: "Sunday Chill",
    genre: "Lo-Fi",
    mood: "Relaxed",
    artwork: "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=800"
  },
  {
    id: 20,
    title: "Weekend Party",
    genre: "Dance",
    mood: "Upbeat",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
  },
  {
    id: 21,
    title: "Lazy Sunday",
    genre: "Jazz",
    mood: "Calm",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800"
  },
  {
    id: 22,
    title: "Weekend Special",
    genre: "Mix",
    mood: "Dynamic",
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
  },
  {
    id: 23,
    title: "Weekend Lounge",
    genre: "Deep House",
    mood: "Relaxed",
    artwork: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"
  },
  {
    id: 24,
    title: "Sunday Sessions",
    genre: "Electronic",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
  }
];

const PlaylistGrid = ({ title, description, playlists }: { title: string; description?: string; playlists: Playlist[] }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
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
          playlists={businessHoursPlaylists}
        />
        
        <PlaylistGrid 
          title="Evening Ambience" 
          description="Perfect for evening atmosphere"
          playlists={eveningPlaylists}
        />
        
        <PlaylistGrid 
          title="Weekend Selection" 
          description="Special weekend playlists"
          playlists={weekendPlaylists}
        />
      </div>
    </div>
  );
}
