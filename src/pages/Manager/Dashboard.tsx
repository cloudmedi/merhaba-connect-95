import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { HeroPlaylist } from "@/components/dashboard/HeroPlaylist";
import { usePlaylistSubscription } from "@/hooks/usePlaylistSubscription";
import { MusicPlayer } from "@/components/MusicPlayer";
import { usePlaylistControl } from "@/components/dashboard/hooks/usePlaylistControl";

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    currentPlaylist,
    isPlaying,
    handlePlayPlaylist,
    handlePlayStateChange,
    handleClose
  } = usePlaylistControl();

  usePlaylistSubscription();

  const { data: heroPlaylist, isLoading: isHeroLoading } = useQuery({
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
    }
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['manager-categories', searchQuery],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, description');

      if (categoriesError) throw categoriesError;

      const categoriesWithPlaylists = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: playlistsData, error: playlistsError } = await supabase
            .from('playlists')
            .select(`
              id,
              name,
              artwork_url,
              genre_id:genres!inner(name),
              mood_id:moods!inner(name),
              is_public,
              assigned_to
            `)
            .or(`is_public.eq.true,assigned_to.cs.{${user.id}}`)
            .ilike('name', `%${searchQuery}%`);

          if (playlistsError) throw playlistsError;

          const { data: categoryPlaylists } = await supabase
            .from('playlist_categories')
            .select('playlist_id')
            .eq('category_id', category.id);

          const categoryPlaylistIds = categoryPlaylists?.map(cp => cp.playlist_id) || [];
          const filteredPlaylists = playlistsData.filter(p => categoryPlaylistIds.includes(p.id));

          return {
            ...category,
            playlists: filteredPlaylists
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
            onPlay={handlePlayPlaylist}
            currentPlayingId={currentPlaylist?.id}
            isPlaying={isPlaying}
          />
        ))}
      </div>

      {currentPlaylist && (
        <MusicPlayer
          key={currentPlaylist.id}
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork,
            songs: currentPlaylist.songs
          }}
          onClose={handleClose}
          onPlayStateChange={handlePlayStateChange}
          autoPlay={true}
        />
      )}
    </div>
  );
}