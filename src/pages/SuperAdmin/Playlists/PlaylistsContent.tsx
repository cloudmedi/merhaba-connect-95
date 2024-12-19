import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { PlaylistsTable } from "../components/PlaylistsTable";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistService } from "@/services/playlist-service";
import type { Playlist } from "@/types/api";
import { toast } from "sonner";

export function PlaylistsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: playlistService.getPlaylists
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: playlistService.deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success("Playlist deleted successfully");
    }
  });

  const handlePlayPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setIsPlayerVisible(true);
    toast.success(`Playing ${playlist.name}`);
  };

  const handleEdit = (playlist: Playlist) => {
    console.log('Handling edit for playlist:', playlist);
    if (!playlist || !playlist._id) {
      toast.error("Invalid playlist data");
      return;
    }

    navigate("create", {
      state: {
        editMode: true,
        playlistData: {
          id: playlist._id,
          name: playlist.name,
          description: playlist.description,
          artworkUrl: playlist.artworkUrl,
          isPublic: playlist.isPublic,
          isHero: playlist.isHero,
          genre: playlist.genre,
          mood: playlist.mood,
          categories: playlist.categories,
          songs: playlist.songs,
          assignedManagers: playlist.assignedManagers
        }
      }
    });
  };

  const filteredPlaylists = playlists?.filter(playlist => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => navigate("create")}
          className="bg-[#6366F1] text-white hover:bg-[#5558DD] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Create New Playlist
        </Button>
      </div>

      <PlaylistsTable 
        playlists={filteredPlaylists}
        onPlay={handlePlayPlaylist}
        onEdit={handleEdit}
        onDelete={(id) => deletePlaylistMutation.mutate(id)}
        isLoading={isLoading}
      />

      {isPlayerVisible && currentPlaylist && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.name,
            artwork: currentPlaylist.artworkUrl || "/placeholder.svg"
          }}
          onClose={() => {
            setIsPlayerVisible(false);
            setCurrentPlaylist(null);
          }}
        />
      )}
    </div>
  );
}