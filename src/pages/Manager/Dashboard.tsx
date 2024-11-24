import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { Button } from "@/components/ui/button";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import { HeroLoader } from "@/components/loaders/HeroLoader";
import { extractDominantColor } from "@/utils/colorExtraction";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  playlists: {
    id: string;
    name: string;
    artwork_url: string;
    genre_id: { name: string } | null;
    mood_id: { name: string } | null;
  }[];
}

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dominantColor, setDominantColor] = useState('rgba(110, 89, 165, 1)');
  const [isColorLoading, setIsColorLoading] = useState(false);
  const navigate = useNavigate();

  const { data: heroPlaylist, isLoading: isHeroLoading, refetch: refetchHero } = useQuery({
    queryKey: ['hero-playlist'],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscribe to playlist changes
  useEffect(() => {
    const channel = supabase
      .channel('hero-playlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlists',
          filter: 'is_hero=eq.true'
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            await refetchHero();
            toast.success("Hero playlist has been updated");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchHero]);

  useEffect(() => {
    const loadDominantColor = async () => {
      if (heroPlaylist?.artwork_url) {
        setIsColorLoading(true);
        try {
          const { primary } = await extractDominantColor(heroPlaylist.artwork_url);
          const solidColor = primary.replace(/[\d.]+\)$/g, '1)');
          setDominantColor(solidColor);
        } catch (error) {
          console.error('Error loading dominant color:', error);
        } finally {
          setIsColorLoading(false);
        }
      }
    };

    loadDominantColor();
  }, [heroPlaylist?.artwork_url]);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
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

      return categoriesWithPlaylists;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredCategories = categories?.filter(category =>
    category.playlists.length > 0
  ) || [];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {isHeroLoading || isColorLoading ? (
        <HeroLoader />
      ) : heroPlaylist && (
        <div 
          className="relative mb-12 rounded-lg overflow-hidden h-[300px] group transition-all duration-500"
          style={{
            backgroundColor: dominantColor,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center justify-between p-8">
            <div className="text-white space-y-4 z-10 max-w-lg">
              <h2 className="text-4xl font-bold">Featured Playlist</h2>
              <p className="text-2xl opacity-90">{heroPlaylist.name}</p>
              <Button 
                onClick={() => navigate(`/manager/playlists/${heroPlaylist.id}`)}
                className="mt-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all border border-white/30"
              >
                Go to Playlist
              </Button>
            </div>
            <div className="w-64 h-64 relative z-10 transition-transform duration-300 group-hover:scale-105">
              <img
                src={heroPlaylist.artwork_url}
                alt="Hero Playlist"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

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