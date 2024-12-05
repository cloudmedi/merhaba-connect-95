import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Database } from "@/integrations/supabase/types";

type PlaylistRow = Database['public']['Tables']['playlists']['Row'];
type Genre = Database['public']['Tables']['genres']['Row'];

interface PlaylistWithRelations extends PlaylistRow {
  company: { name: string } | null;
  profiles: { first_name: string; last_name: string } | null;
  genres: { name: string } | null;
}

export function PlaylistsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistWithRelations | null>(null);
  const navigate = useNavigate();

  const { data: playlists = [], isLoading: isPlaylistsLoading } = useQuery<PlaylistWithRelations[]>({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          company:company_id(name),
          profiles:created_by(first_name, last_name),
          genres:genre_id(name)
        `);

      if (error) throw error;
      return data as PlaylistWithRelations[];
    }
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || playlist.genre_id === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-[600px]">
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
          <Select
            value={selectedGenre}
            onValueChange={setSelectedGenre}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => navigate("create")}
          className="bg-[#FFD700] text-black hover:bg-[#E6C200] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Create New Playlist
        </Button>
      </div>

      <PlaylistGrid 
        title="All Playlists"
        playlists={filteredPlaylists.map(p => ({
          id: p.id,
          title: p.name,
          artwork_url: p.artwork_url || "/placeholder.svg",
          genre: p.genres?.name || "Unknown Genre",
          mood: "Various"
        }))}
        isLoading={isPlaylistsLoading}
        onPlay={setCurrentPlaylist}
      />

      {currentPlaylist && (
        <MusicPlayer 
          playlist={{
            title: currentPlaylist.name,
            artwork: currentPlaylist.artwork_url || "/placeholder.svg"
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}