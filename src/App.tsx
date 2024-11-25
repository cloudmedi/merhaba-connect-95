import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlayCircle, Music2 } from "lucide-react";

function App() {
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);

  const handlePlayDemo = () => {
    setCurrentPlaylist({
      title: "Demo Playlist",
      artwork: "/placeholder.svg",
      songs: [
        {
          id: 1,
          title: "Demo Song 1",
          artist: "Demo Artist",
          duration: "3:45",
          file_url: "https://example.com/song1.mp3"
        }
      ]
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Offline Music Player</h1>
              <p className="text-gray-400">Your personal music library</p>
            </div>
            <Button 
              onClick={handlePlayDemo}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Play Demo
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Empty State */}
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
              <Music2 className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Music Found</h3>
              <p className="text-gray-400 text-center mb-4">
                Start by adding some music to your library or sync with your devices
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Add Music
              </Button>
            </div>
          </div>
        </div>

        {/* Music Player */}
        {currentPlaylist && (
          <MusicPlayer
            playlist={currentPlaylist}
            onClose={() => setCurrentPlaylist(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default App;