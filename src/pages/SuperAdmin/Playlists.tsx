import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";
import { PlaylistsTable } from "./components/PlaylistsTable";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Routes, Route, useNavigate } from "react-router-dom";

const playlists = [
  {
    id: 1,
    title: "Jazz Hop Cafe",
    venue: "Sunny Chill House",
    assignedTo: ["Manager 1", "Manager 2"],
    status: "Active",
    createdAt: "2024-02-20",
    description: "Relaxing jazz hop beats",
    artwork: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
    selectedSongs: [],
    selectedUsers: [],
    selectedGenres: [],
    selectedCategories: [],
    selectedMoods: [],
  },
  {
    id: 2,
    title: "Slap House Jam",
    venue: "Sunny Chill House",
    assignedTo: ["Manager 3"],
    status: "Active",
    createdAt: "2024-02-19",
    artwork: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
  },
  {
    id: 3,
    title: "Colombia - Salsa",
    venue: "Sunny Chill House",
    assignedTo: ["Manager 1"],
    status: "Inactive",
    createdAt: "2024-02-18",
    artwork: "/lovable-uploads/c90b24e7-421c-4165-a1ff-44a7a80de37b.png",
  },
];

export default function Playlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlayPlaylist = (playlist: any) => {
    if (currentPlaylist?.id !== playlist.id) {
      setCurrentPlaylist(playlist);
      setIsPlayerVisible(true);
      toast({
        title: "Now Playing",
        description: `Playing ${playlist.title}`,
      });
    }
  };

  const PlaylistsContent = () => (
    <DashboardLayout 
      title="Playlists" 
      description="Manage and organize your playlists"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate("create")}
            className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
          >
            <Plus className="w-4 h-4 mr-2" /> Yeni Playlist Oluştur
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search playlists..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <PlaylistsTable 
          playlists={playlists}
          onPlay={handlePlayPlaylist}
          onEdit={(playlist) => navigate("create", { 
            state: { editMode: true, playlistData: playlist } 
          })}
        />
      </div>
      {isPlayerVisible && currentPlaylist && (
        <MusicPlayer 
          playlist={currentPlaylist} 
          onClose={() => {
            setIsPlayerVisible(false);
            setCurrentPlaylist(null);
          }} 
        />
      )}
    </DashboardLayout>
  );

  return (
    <Routes>
      <Route path="/" element={<PlaylistsContent />} />
      <Route
        path="create"
        element={
          <DashboardLayout 
            title="Create Playlist" 
            description="Create a new playlist"
          >
            <CreatePlaylist />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
