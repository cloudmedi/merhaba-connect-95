import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";

interface Category {
  id: string;
  name: string;
  description: string;
  playlists: {
    id: string;
    name: string;
    artwork_url: string;
    genre: { name: string } | null;
    mood: { name: string } | null;
  }[];
}

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ['manager-categories', searchQuery],
    queryFn: async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, description');

      if (categoriesError) throw categoriesError;

      const categoriesWithPlaylists = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: playlistsData, error: playlistsError } = await supabase
            .from('playlist_categories')
            .select(`
              playlist_id,
              playlists (
                id,
                name,
                artwork_url,
                genre:genres(name),
                mood:moods(name)
              )
            `)
            .eq('category_id', category.id)
            .eq('playlists.is_public', true)
            .ilike('playlists.name', `%${searchQuery}%`);

          if (playlistsError) throw playlistsError;

          const playlists = playlistsData
            .map(item => item.playlists)
            .filter(playlist => playlist !== null);

          return {
            ...category,
            playlists: playlists
          };
        })
      );

      return categoriesWithPlaylists;
    }
  });

  const filteredCategories = categories?.filter(category =>
    category.playlists.length > 0
  ) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Music For Your Business</h1>
          <p className="text-gray-500 mt-1">Explore popular venue soundtracks</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No playlists available</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <PlaylistGrid
              key={category.id}
              title={category.name}
              description={category.description}
              categoryId={category.id}
              playlists={category.playlists.map(playlist => ({
                id: playlist.id,
                title: playlist.name,
                artwork_url: playlist.artwork_url,
                genre: playlist.genre?.name || "Various",
                mood: playlist.mood?.name || "Various"
              }))}
            />
          ))
        )}
      </div>
    </div>
  );
}