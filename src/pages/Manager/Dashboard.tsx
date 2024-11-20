import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PlaylistItem {
  title: string;
  genre: string;
  mood: string;
  image: string;
}

const playlists: PlaylistItem[] = [
  {
    title: "Summer Vibes 2024",
    genre: "Pop",
    mood: "Energetic",
    image: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png"
  },
  {
    title: "Relaxing Jazz",
    genre: "Jazz",
    mood: "Calm",
    image: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    title: "Coffee Shop Ambience",
    genre: "Ambient",
    mood: "Relaxed",
    image: "/lovable-uploads/db3fbe19-e5ea-4571-b9be-e6e5f633c112.png"
  },
  {
    title: "Shopping Mall Hits",
    genre: "Pop",
    mood: "Upbeat",
    image: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png"
  },
  {
    title: "Dinner Time Classics",
    genre: "Classical",
    mood: "Elegant",
    image: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    title: "Modern Workspace",
    genre: "Electronic",
    mood: "Focused",
    image: "/lovable-uploads/db3fbe19-e5ea-4571-b9be-e6e5f633c112.png"
  }
];

const PlaylistSection = ({ title, description }: { title: string; description?: string }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {playlists.map((playlist, index) => (
        <Card key={index} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="aspect-square overflow-hidden">
            <img
              src={playlist.image}
              alt={playlist.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm text-gray-900 truncate">{playlist.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{playlist.genre}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-500">{playlist.mood}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const FeaturedSection = () => (
  <Card className="bg-red-600 text-white p-6 mb-8">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Chill Beats</h1>
        <p className="text-sm opacity-90 max-w-2xl">
          Feel the groove with tracks like "Conquer the Storm," "My Side," and "Magic Ride." Let the
          soothing beats take you on a journey through laid-back melodies and chill vibes, perfect for
          any relaxing moment.
        </p>
      </div>
      <img
        src="/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png"
        alt="Chill Beats"
        className="w-24 h-24 object-cover rounded-lg"
      />
    </div>
  </Card>
);

export default function ManagerDashboard() {
  return (
    <div className="p-6 space-y-8">
      <FeaturedSection />
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cafe Channel</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>
        
        <PlaylistSection 
          title="Cafe Channel" 
          description="Time to get cozy" 
        />
        
        <PlaylistSection 
          title="Popular today" 
          description="Time to get cozy" 
        />
        
        <PlaylistSection 
          title="Trending Playlists" 
          description="Time to get cozy" 
        />
      </div>
    </div>
  );
}