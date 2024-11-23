import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createPlaylistAssignmentNotification } from "@/utils/notifications";

interface PlaylistFormData {
  title: string;
  description: string;
  artwork: File | null;
  artwork_url?: string;
  isPublic?: boolean;
  selectedSongs?: any[];
  selectedUsers?: any[];
  selectedGenres?: any[];
  selectedCategories?: any[];
  selectedMoods?: any[];
  moodId?: string;
  genreId?: string;
}

interface SavePlaylistParams {
  playlistData: PlaylistFormData;
  isEditMode?: boolean;
  existingPlaylist?: any;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const usePlaylistMutations = () => {
  const queryClient = useQueryClient();

  const createPlaylist = useMutation({
    mutationFn: async (playlistData: PlaylistFormData) => {
      try {
        // Upload artwork if provided
        let artwork_url = playlistData.artwork_url;
        if (playlistData.artwork) {
          // Convert file to base64
          const fileData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(playlistData.artwork);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });

          const base64Data = (fileData as string).split(',')[1];
          const fileExt = playlistData.artwork.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;

          // Upload to Bunny CDN via Edge Function
          const response = await fetch('/functions/v1/upload-artwork', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileData: base64Data,
              fileName,
              contentType: playlistData.artwork.type
            })
          });

          if (!response.ok) {
            throw new Error('Failed to upload artwork');
          }

          const { url } = await response.json();
          artwork_url = url;
        }

        // Create playlist
        const { data: playlist, error: playlistError } = await supabase
          .from('playlists')
          .insert({
            name: playlistData.title,
            description: playlistData.description,
            artwork_url,
            is_public: playlistData.isPublic,
            mood_id: playlistData.selectedMoods?.[0]?.id,
            genre_id: playlistData.selectedGenres?.[0]?.id
          })
          .select()
          .single();

        if (playlistError) throw playlistError;

        // Add categories if any
        if (playlistData.selectedCategories?.length) {
          const categoryAssignments = playlistData.selectedCategories.map(category => ({
            playlist_id: playlist.id,
            category_id: typeof category === 'string' ? category : category.id
          }));

          const { error: categoriesError } = await supabase
            .from('playlist_categories')
            .insert(categoryAssignments);

          if (categoriesError) throw categoriesError;
        }

        // Send notifications if the playlist is public and there are selected users
        if (playlistData.isPublic && playlistData.selectedUsers && playlistData.selectedUsers.length > 0) {
          for (const user of playlistData.selectedUsers) {
            await createPlaylistAssignmentNotification(
              user.id, 
              playlistData.title,
              playlist.id,
              artwork_url || undefined
            );
          }
        }

        await queryClient.invalidateQueries({ queryKey: ['playlists'] });
        toast.success('Playlist created successfully');
        return playlist;
      } catch (error: any) {
        console.error('Error saving playlist:', error);
        toast.error(error.message);
        throw error;
      }
    }
  });

  const handleSavePlaylist = async ({
    playlistData,
    isEditMode,
    existingPlaylist,
    onSuccess,
    onError
  }: SavePlaylistParams) => {
    try {
      await createPlaylist.mutateAsync(playlistData);
      onSuccess?.();
    } catch (error: any) {
      onError?.(error);
    }
  };

  return {
    createPlaylist,
    handleSavePlaylist
  };
};