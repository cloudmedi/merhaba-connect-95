import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork_url?: string;
  is_public: boolean;
  is_hero: boolean;
  created_by: string;
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    file_url: string;
  }>;
  genre_id?: string;
  mood_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
  artwork_url?: string;
  is_public?: boolean;
  is_hero?: boolean;
  genre_id?: string;
  mood_id?: string;
  songs?: string[];
}

export interface PlaylistUpdateInput extends Partial<PlaylistCreateInput> {}

export const playlistService = {
  async getPlaylists() {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          songs:playlist_songs(
            song:songs(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to fetch playlists');
      throw error;
    }
  },

  async getPlaylistById(id: string) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          songs:playlist_songs(
            song:songs(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to fetch playlist');
      throw error;
    }
  },

  async createPlaylist(input: PlaylistCreateInput) {
    try {
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert([{
          name: input.name,
          description: input.description,
          artwork_url: input.artwork_url,
          is_public: input.is_public,
          is_hero: input.is_hero,
          genre_id: input.genre_id,
          mood_id: input.mood_id,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (playlistError) throw playlistError;

      if (input.songs?.length) {
        const playlistSongs = input.songs.map((songId, index) => ({
          playlist_id: playlist.id,
          song_id: songId,
          position: index + 1
        }));

        const { error: songsError } = await supabase
          .from('playlist_songs')
          .insert(playlistSongs);

        if (songsError) throw songsError;
      }

      toast.success('Playlist created successfully');
      return playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
      throw error;
    }
  },

  async updatePlaylist(id: string, input: PlaylistUpdateInput) {
    try {
      const { error } = await supabase
        .from('playlists')
        .update({
          name: input.name,
          description: input.description,
          artwork_url: input.artwork_url,
          is_public: input.is_public,
          is_hero: input.is_hero,
          genre_id: input.genre_id,
          mood_id: input.mood_id
        })
        .eq('id', id);

      if (error) throw error;

      if (input.songs) {
        // First delete existing songs
        await supabase
          .from('playlist_songs')
          .delete()
          .eq('playlist_id', id);

        // Then insert new songs
        const playlistSongs = input.songs.map((songId, index) => ({
          playlist_id: id,
          song_id: songId,
          position: index + 1
        }));

        const { error: songsError } = await supabase
          .from('playlist_songs')
          .insert(playlistSongs);

        if (songsError) throw songsError;
      }

      toast.success('Playlist updated successfully');
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist');
      throw error;
    }
  },

  async deletePlaylist(id: string) {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
      throw error;
    }
  }
};