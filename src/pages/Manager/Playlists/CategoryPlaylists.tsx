import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CatalogLoader } from "@/components/loaders/CatalogLoader";
import ContentLoader from 'react-content-loader';

export function CategoryPlaylists() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['category-playlists', categoryId],
    queryFn: async () => {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;

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
        .eq('category_id', categoryId);

      if (playlistsError) throw playlistsError;

      const playlists = playlistsData
        .map(item => item.playlists)
        .filter(playlist => playlist !== null);

      return {
        category,
        playlists
      };
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="mb-8">
          <ContentLoader
            speed={2}
            width={300}
            height={80}
            viewBox="0 0 300 80"
            backgroundColor="#f5f5f5"
            foregroundColor="#eeeeee"
            className="skeleton-loading"
          >
            <rect x="0" y="0" rx="4" ry="4" width="200" height="32" />
            <rect x="0" y="48" rx="4" ry="4" width="280" height="20" />
          </ContentLoader>
        </div>
        <CatalogLoader count={12} />
      </div>
    );
  }

  if (!data) {
    return <div>Category not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/manager")}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Media Library
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{data.category.name}</h1>
        {data.category.description && (
          <p className="text-gray-500 mt-1">{data.category.description}</p>
        )}
      </div>

      <PlaylistGrid
        title="All Playlists"
        playlists={data.playlists.map(playlist => ({
          id: playlist.id,
          title: playlist.name,
          artwork_url: playlist.artwork_url,
          genre: playlist.genre?.name || "Various",
          mood: playlist.mood?.name || "Various"
        }))}
      />
    </div>
  );
}
