import { supabase } from "@/integrations/supabase/client";

interface SavePlaylistParams {
  playlistData: any;
  isEditMode: boolean;
  existingPlaylist?: any;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePlaylistMutations() {
  const handleSavePlaylist = async ({
    playlistData,
    isEditMode,
    existingPlaylist,
    onSuccess,
    onError
  }: SavePlaylistParams) => {
    try {
      if (!playlistData.title) {
        throw new Error("Please enter a playlist title");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      let artwork_url = playlistData.artwork_url;
      if (playlistData.artwork) {
        const reader = new FileReader();
        const fileBase64Promise = new Promise((resolve) => {
          reader.onload = () => {
            const base64 = reader.result?.toString().split(',')[1];
            resolve(base64);
          };
        });
        reader.readAsDataURL(playlistData.artwork);
        const fileBase64 = await fileBase64Promise;

        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-artwork', {
          body: {
            fileData: fileBase64,
            fileName: `${crypto.randomUUID()}.${playlistData.artwork.name.split('.').pop()}`,
            contentType: playlistData.artwork.type
          }
        });

        if (uploadError) throw uploadError;
        artwork_url = uploadData.url;
      }

      const playlistPayload = {
        name: playlistData.title,
        description: playlistData.description,
        artwork_url,
        is_public: false,
        created_by: user.id,
        genre_id: playlistData.selectedGenres[0]?.id || null,
        mood_id: playlistData.selectedMoods[0]?.id || null,
      };

      let playlist;
      if (isEditMode && existingPlaylist) {
        const { data, error } = await supabase
          .from('playlists')
          .update(playlistPayload)
          .eq('id', existingPlaylist.id)
          .select()
          .single();

        if (error) throw error;
        playlist = data;

        // Delete existing playlist songs and categories
        await supabase.from('playlist_songs').delete().eq('playlist_id', existingPlaylist.id);
        await supabase.from('playlist_categories').delete().eq('playlist_id', existingPlaylist.id);
      } else {
        const { data, error } = await supabase
          .from('playlists')
          .insert([playlistPayload])
          .select()
          .single();

        if (error) throw error;
        playlist = data;
      }

      // Insert playlist songs
      if (playlistData.selectedSongs.length > 0) {
        const playlistSongs = playlistData.selectedSongs.map((song: any, index: number) => ({
          playlist_id: playlist.id,
          song_id: song.id,
          position: index
        }));

        const { error: songsError } = await supabase
          .from('playlist_songs')
          .insert(playlistSongs);

        if (songsError) throw songsError;
      }

      // Insert playlist categories
      if (playlistData.selectedCategories.length > 0) {
        const playlistCategories = playlistData.selectedCategories.map((category: any) => ({
          playlist_id: playlist.id,
          category_id: category.id
        }));

        const { error: categoriesError } = await supabase
          .from('playlist_categories')
          .insert(playlistCategories);

        if (categoriesError) throw categoriesError;
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving playlist:', error);
      onError?.(error);
      throw error;
    }
  };

  return { handleSavePlaylist };
}