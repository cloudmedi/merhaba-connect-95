import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PreviewPlaylist } from "../types";

export function useHeroPlaylists() {
  return useQuery({
    queryKey: ['hero-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          playlist_songs (
            position,
            songs (
              id,
              title,
              artist,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('is_catalog', true)
        .limit(8);
      
      if (error) throw error;

      // Playlist verilerini düzenle ve doğru formata getir
      const formattedPlaylists: PreviewPlaylist[] = data
        .filter(playlist => playlist.playlist_songs?.length > 0)
        .map(playlist => ({
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

      return formattedPlaylists;
    }
  });
}