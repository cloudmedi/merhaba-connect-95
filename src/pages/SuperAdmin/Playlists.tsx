import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";
import { PlaylistsTable } from "./components/PlaylistsTable";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistService } from "@/services/playlist-service";
import type { Playlist } from "@/types/api";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Playlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: playlistService.getPlaylists
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: playlistService.deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast({
        title: "Success",
        description: "Playlist deleted successfully",
      });
    }
  });

  const handlePlayPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setIsPlayerVisible(true);
    toast({
      title: "Now Playing",
      description: `Playing ${playlist.name}`,
    });
  };

  const filteredPlaylists = playlists?.filter(playlist => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
            <Plus className="w-4 h-4 mr-2" /> Create New Playlist
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
          playlists={filteredPlaylists}
          onPlay={handlePlayPlaylist}
          onEdit={(playlist) => navigate("create", { 
            state: { editMode: true, playlistData: playlist } 
          })}
          onDelete={(id) => deletePlaylistMutation.mutate(id)}
          isLoading={isLoading}
        />
      </div>
      {isPlayerVisible && currentPlaylist && (
        <MusicPlayer 
          playlist={{
            title: currentPlaylist.name,
            artwork: currentPlaylist.artwork_url || "/placeholder.svg"
          }}
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