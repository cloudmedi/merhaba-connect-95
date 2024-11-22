import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function GenrePlaylists() {
  const { genreId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['genre-playlists', genreId],
    queryFn: async () => {
      // First get genre details
      const { data: genre, error: genreError } = await supabase
        .from('genres')
        .select('*')
        .eq('id', genreId)
        .single();

      if (genreError) throw genreError;

      // Then get playlists with this genre
      const { data: playlists, error: playlistsError } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          genre:genres(name),
          mood:moods(name)
        `)
        .eq('genre_id', genreId)
        .eq('is_public', true);

      if (playlistsError) throw playlistsError;

      return {
        genre,
        playlists
      };
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!data?.genre) {
    return <div className="p-8">Genre not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{data.genre.name}</h1>
        {data.genre.description && (
          <p className="text-gray-500 mt-1">{data.genre.description}</p>
        )}
      </div>

      <PlaylistGrid
        title="Playlists"
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