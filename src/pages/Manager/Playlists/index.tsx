import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { GridPlaylist } from "@/components/dashboard/types";
import { MusicPlayer } from "@/components/MusicPlayer";
import api from "@/lib/api";

export default function Playlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState<GridPlaylist | null>(null);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['manager-playlists', searchQuery],
    queryFn: async () => {
      const response = await api.get('/admin/playlists', {
        params: { search: searchQuery }
      });
      return response.data;
    }
  });

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const transformedPlaylists: GridPlaylist[] = filteredPlaylists.map(playlist => ({
    id: playlist.id,
    title: playlist.name,
    artwork_url: playlist.artwork_url || "/placeholder.svg",
    genre: playlist.genre?.name || "Various",
    mood: playlist.mood?.name || "Various"
  }));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500">Browse and manage your playlists</p>
        </div>
        <div className="relative w-64">
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

      <PlaylistGrid
        title="All Playlists"
        playlists={transformedPlaylists}
        isLoading={isLoading}
        onPlay={setCurrentPlaylist}
      />

      {currentPlaylist && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork_url,
            songs: [] // We'll need to fetch songs when implementing play functionality
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}