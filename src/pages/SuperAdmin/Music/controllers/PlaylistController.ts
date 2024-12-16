import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class PlaylistController {
  static async createPlaylist(data: {
    name: string;
    description?: string;
    songIds: string[];
    isPublic?: boolean;
    artworkUrl?: string;
  }) {
    try {
      // First create the playlist
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert({
          name: data.name,
          description: data.description,
          is_public: data.isPublic,
          artwork_url: data.artworkUrl,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Then add songs to the playlist
      if (data.songIds.length > 0) {
        const playlistSongs = data.songIds.map((songId, index) => ({
          playlist_id: playlist.id,
          song_id: songId,
          position: index + 1
        }));

        const { error: songsError } = await supabase
          .from('playlist_songs')
          .insert(playlistSongs);

        if (songsError) throw songsError;
      }

      toast.success('Çalma listesi oluşturuldu');
      return playlist;

    } catch (error: any) {
      console.error('Create playlist error:', error);
      toast.error(`Çalma listesi oluşturulurken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async updatePlaylist(playlistId: string, data: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    artworkUrl?: string;
  }) {
    try {
      const { error } = await supabase
        .from('playlists')
        .update({
          name: data.name,
          description: data.description,
          is_public: data.isPublic,
          artwork_url: data.artworkUrl
        })
        .eq('id', playlistId);

      if (error) throw error;

      toast.success('Çalma listesi güncellendi');
    } catch (error: any) {
      console.error('Update playlist error:', error);
      toast.error(`Çalma listesi güncellenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async deletePlaylist(playlistId: string) {
    try {
      // First delete all playlist songs
      await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId);

      // Then delete the playlist
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      toast.success('Çalma listesi silindi');
    } catch (error: any) {
      console.error('Delete playlist error:', error);
      toast.error(`Çalma listesi silinirken hata oluştu: ${error.message}`);
      throw error;
    }
  }
}