import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PreviewPlaylist } from "../types";

export function usePublicPlaylists() {
  return useQuery({
    queryKey: ['public-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          genre:genres(name),
          mood:moods(name),
          playlist_songs!inner(
            position,
            songs!inner(
              id,
              title,
              artist,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('is_catalog', true)
        .eq('is_public', true)
        .limit(8);

      if (error) {
        console.error('Error fetching playlists:', error);
        throw error;
      }

      return data.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        artwork_url: playlist.artwork_url,
        songs: playlist.playlist_songs
          .sort((a, b) => a.position - b.position)
          .map(ps => ({
            id: ps.songs.id,
            title: ps.songs.title,
            artist: ps.songs.artist || 'Bilinmeyen Sanatçı',
            file_url: ps.songs.bunny_id 
              ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}` 
              : ps.songs.file_url
          }))
      }));
    }
  });
}