import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { HeroPlaylist } from "@/components/dashboard/HeroPlaylist";
import { usePlaylistSubscription } from "@/hooks/usePlaylistSubscription";

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Set up realtime subscription
  usePlaylistSubscription();

  const { data: heroPlaylist, isLoading: isHeroLoading } = useQuery({
    queryKey: ['hero-playlist'],
    queryFn: async () => {
      console.log('Fetching hero playlist');
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          genre_id:genres!inner(name),
          mood_id:moods!inner(name)
        `)
        .eq('is_hero', true)
        .single();

      if (error) {
        console.error('Error fetching hero playlist:', error);
        throw error;
      }
      
      console.log('Hero playlist data:', data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['manager-categories', searchQuery],
    queryFn: async () => {
      console.log('Fetching categories');
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
                genre_id:genres!inner(name),
                mood_id:moods!inner(name)
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

      console.log('Categories with playlists:', categoriesWithPlaylists);
      return categoriesWithPlaylists;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredCategories = categories?.filter(category =>
    category.playlists.length > 0
  ) || [];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <HeroPlaylist 
        playlist={heroPlaylist} 
        isLoading={isHeroLoading} 
      />

      <div className="flex justify-end mb-8">
        <div className="relative w-64">
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
        {filteredCategories.map((category) => (
          <PlaylistGrid
            key={category.id}
            title={category.name}
            description={category.description}
            categoryId={category.id}
            playlists={category.playlists.map(playlist => ({
              id: playlist.id,
              title: playlist.name,
              artwork_url: playlist.artwork_url,
              genre: playlist.genre_id?.name || "Various",
              mood: playlist.mood_id?.name || "Various"
            }))}
            isLoading={isCategoriesLoading}
          />
        ))}
      </div>
    </div>
  );
}