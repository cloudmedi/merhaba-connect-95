import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import ContentLoader from 'react-content-loader';

const TitleLoader = () => (
  <ContentLoader
    speed={2}
    width={300}
    height={80}
    viewBox="0 0 300 80"
    backgroundColor="#f5f5f5"
    foregroundColor="#eeeeee"
  >
    <rect x="0" y="0" rx="4" ry="4" width="200" height="24" />
    <rect x="0" y="35" rx="3" ry="3" width="150" height="16" />
  </ContentLoader>
);

export function CategoryPlaylists() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['category-playlists', categoryId],
    queryFn: async () => {
      // Önce mevcut kullanıcının ID'sini al
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Kategori detaylarını getir
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;

      // Bu kategorideki playlistleri getir (sadece public veya kullanıcıya atanmış olanlar)
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
            is_public,
            assigned_to
          )
        `)
        .eq('category_id', categoryId);

      if (playlistsError) throw playlistsError;

      // Playlistleri filtrele - sadece public olanları veya kullanıcıya atananları göster
      const filteredPlaylists = playlistsData
        .map(item => item.playlists)
        .filter(playlist => playlist !== null)
        .filter(playlist => 
          playlist.is_public || 
          (playlist.assigned_to && playlist.assigned_to.includes(user.id))
        );

      return {
        category,
        playlists: filteredPlaylists
      };
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/manager")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Media Library
          </Button>
          <TitleLoader />
        </div>
        <CatalogLoader count={6} />
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