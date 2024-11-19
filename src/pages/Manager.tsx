import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Mock data - In a real app, this would come from an API
const playlists = [
  {
    id: 1,
    title: "Jazz Hop Cafe",
    venue: "Sunny Chill House",
    image: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
    assignedBy: "Super Admin"
  },
  {
    id: 2,
    title: "Slap House Jam",
    venue: "Sunny Chill House",
    image: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
    assignedBy: "Super Admin"
  }
];

export default function Manager() {
  const { toast } = useToast();

  const handlePlayClick = (playlistId: number) => {
    toast({
      title: "Playing Playlist",
      description: `Now playing playlist ${playlistId}`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="text-[#FFD700] text-2xl font-bold">veeq</div>
        <nav className="flex items-center space-x-6">
          <a href="#" className="text-black hover:text-[#FFD700] transition-colors">Home</a>
          <a href="#" className="text-black hover:text-[#FFD700] transition-colors">Campaigns</a>
          <a href="#" className="text-black hover:text-[#FFD700] transition-colors">Device</a>
          <a href="#" className="text-black hover:text-[#FFD700] transition-colors">Calendar</a>
          <button className="bg-[#FFD700] text-black px-4 py-2 rounded-full font-medium hover:bg-[#E6C200] transition-colors">
            User Name
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-6">
        {/* Hero Section */}
        <div className="relative bg-[#8B4543] p-8 rounded-xl overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm text-white/80 mb-2">Sunny Chill House</p>
            <h1 className="text-4xl font-bold text-white mb-4">Assigned Playlists</h1>
            <p className="text-lg text-white/90">
              View and manage all the playlists assigned to you by the Super Admin.
              Click on a playlist to start playing it in your venue.
            </p>
          </div>
          <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10"></div>
        </div>

        {/* Playlist Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-black">Your Playlists</h2>
              <p className="text-sm text-gray-500">Playlists assigned by Super Admin</p>
            </div>
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Search playlists" 
                className="pl-10 bg-white border-gray-200 w-64 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="relative aspect-square">
                  <img 
                    src={playlist.image} 
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handlePlayClick(playlist.id)}
                      className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center text-black hover:bg-[#E6C200] transition-colors"
                    >
                      ▶
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-black">{playlist.title}</h3>
                  <p className="text-sm text-gray-500">{playlist.venue}</p>
                  <p className="text-xs text-gray-400 mt-1">Assigned by {playlist.assignedBy}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-100 rounded"></div>
            <div>
              <p className="font-medium text-black">Select a playlist</p>
              <p className="text-sm text-gray-500">No playlist playing</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-black hover:bg-[#E6C200] transition-colors">
              ▶
            </button>
            <div className="w-96 h-1 bg-gray-200 rounded-full">
              <div className="w-1/3 h-full bg-[#FFD700] rounded-full"></div>
            </div>
          </div>
          <button className="w-8 h-8">🔊</button>
        </div>
      </div>
    </div>
  );
}