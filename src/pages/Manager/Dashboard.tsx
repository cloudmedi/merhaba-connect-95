import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GridPlaylist } from "@/components/dashboard/types";

const transformPlaylistToGridFormat = (playlist: any): GridPlaylist => ({
  id: playlist.id,
  title: playlist.name,
  artwork_url: playlist.artwork_url || "/placeholder.svg",
  genre: playlist.genres?.name || "Various",
  mood: playlist.moods?.name || "Various",
});

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categorizedPlaylists, isLoading } = useQuery({
    queryKey: ['categories-with-playlists'],
    queryFn: async () => {
      // First fetch all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Then fetch all playlists with their related data and category relationships
      const { data: playlists, error: playlistsError } = await supabase
        .from('playlists')
        .select(`
          *,
          genres:genre_id(*),
          moods:mood_id(*),
          playlist_categories!inner (
            category_id
          )
        `)
        .order('created_at', { ascending: false });

      if (playlistsError) throw playlistsError;

      // Group playlists by category
      return categories.map(category => ({
        category,
        playlists: playlists
          .filter(playlist => {
            // First check if the playlist belongs to this category
            const belongsToCategory = playlist.playlist_categories.some(
              (pc: any) => pc.category_id === category.id
            );

            // Then apply search filter if there's a search query
            if (searchQuery && belongsToCategory) {
              return playlist.name.toLowerCase().includes(searchQuery.toLowerCase());
            }

            return belongsToCategory;
          })
          .map(transformPlaylistToGridFormat)
      }));
    },
  });

  return (
    <div>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {categorizedPlaylists?.map(({ category, playlists }) => (
          <PlaylistGrid 
            key={category.id}
            title={category.name} 
            description={category.description || `Playlists in ${category.name}`}
            playlists={playlists}
            isLoading={isLoading}
          />
        ))}
        
        {categorizedPlaylists?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories or playlists found.</p>
          </div>
        )}
      </div>
    </div>
  );
}