import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GridPlaylist } from "@/components/dashboard/types";
import type { Playlist } from "@/types/api";

const transformPlaylistToGridFormat = (playlist: Playlist): GridPlaylist => ({
  id: playlist.id,
  title: playlist.name,
  artwork_url: playlist.artwork_url || "/placeholder.svg",
  genre: "Various", // You might want to fetch this from the genres table
  mood: "Various", // You might want to fetch this from the moods table
});

// Fetch categories and their playlists
const fetchCategoriesWithPlaylists = async () => {
  // First fetch all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (categoriesError) throw categoriesError;

  // Then fetch all playlists
  const { data: playlists, error: playlistsError } = await supabase
    .from('playlists')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false });

  if (playlistsError) throw playlistsError;

  // Group playlists by category
  const playlistsByCategory = categories.map(category => ({
    category,
    playlists: playlists
      .filter(playlist => playlist.category?.id === category.id)
      .map(transformPlaylistToGridFormat)
  }));

  return playlistsByCategory;
};

export default function ManagerDashboard() {
  const { data: categorizedPlaylists, isLoading } = useQuery({
    queryKey: ['categories-with-playlists'],
    queryFn: fetchCategoriesWithPlaylists,
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