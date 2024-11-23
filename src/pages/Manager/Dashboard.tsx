import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { Button } from "@/components/ui/button";

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

  const { data: latestBarPlaylist } = useQuery({
    queryKey: ['latest-bar-playlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('most_played_bar_playlists')
        .select(`
          id,
          name,
          artwork_url,
          genre_name,
          mood_name
        `)
        .order('play_count', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    }
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['manager-categories'],
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
            .eq('playlists.is_public', true);

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
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    category.playlists.length > 0
  ) || [];

  const defaultArtwork = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819";
  const artworkUrl = latestBarPlaylist?.artwork_url || defaultArtwork;

  return (
    <div>
      {latestBarPlaylist && (
        <div 
          className="relative mb-12 rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url(${artworkUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '300px'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-between p-8">
            <div className="text-white space-y-4">
              <h2 className="text-3xl font-bold">Music For Your Business</h2>
              <p className="text-lg opacity-90">Explore popular venue soundtracks</p>
              <Button 
                className="mt-4 bg-white text-black hover:bg-gray-100"
                onClick={() => window.location.href = `/manager/playlists/${latestBarPlaylist.id}`}
              >
                Go to Playlist
              </Button>
            </div>
            <div className="w-64 h-64 relative">
              <img
                src={artworkUrl}
                alt="Latest Bar Playlist"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
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