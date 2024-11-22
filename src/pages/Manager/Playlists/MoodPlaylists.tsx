import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function MoodPlaylists() {
  const { moodId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['mood-playlists', moodId],
    queryFn: async () => {
      // First get mood details
      const { data: mood, error: moodError } = await supabase
        .from('moods')
        .select('*')
        .eq('id', moodId)
        .single();

      if (moodError) throw moodError;

      // Then get playlists with this mood
      const { data: playlists, error: playlistsError } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          genre:genres(name),
          mood:moods(name)
        `)
        .eq('mood_id', moodId)
        .eq('is_public', true);

      if (playlistsError) throw playlistsError;

      return {
        mood,
        playlists
      };
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!data?.mood) {
    return <div className="p-8">Mood not found</div>;
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
        <h1 className="text-2xl font-bold text-gray-900">{data.mood.name}</h1>
        {data.mood.description && (
          <p className="text-gray-500 mt-1">{data.mood.description}</p>
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