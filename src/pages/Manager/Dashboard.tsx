import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useToast } from "@/hooks/use-toast";

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Get current user's company_id
  const { data: userData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile;
    }
  });

  // Fetch playlists for the user's company
  const { data: categories, isLoading } = useQuery({
    queryKey: ['manager-categories', userData?.company_id],
    queryFn: async () => {
      if (!userData?.company_id) return [];

      // First, fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, description');

      if (categoriesError) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
        throw categoriesError;
      }

      // For each category, fetch associated playlists through playlist_categories
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
                mood:moods(name),
                company_id
              )
            `)
            .eq('category_id', category.id);

          if (playlistsError) throw playlistsError;

          // Filter playlists to only include those that belong to the user's company or are public
          const playlists = playlistsData
            .map(item => item.playlists)
            .filter(playlist => playlist !== null)
            .filter(playlist => playlist.company_id === userData.company_id || playlist.is_public);

          return {
            ...category,
            playlists
          };
        })
      );

      return categoriesWithPlaylists;
    },
    enabled: !!userData?.company_id,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load playlists",
          variant: "destructive"
        });
      }
    }
  });

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your business settings</p>
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
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <PlaylistGrid
              key={category.id}
              title={category.name}
              description={category.description}
              playlists={category.playlists.map(playlist => ({
                id: playlist.id,
                title: playlist.name,
                artwork_url: playlist.artwork_url || "/placeholder.svg",
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