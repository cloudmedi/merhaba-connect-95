import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { createPlaylistAssignmentNotification } from "@/utils/notifications";

interface SavePlaylistParams {
  playlistData: any;
  isEditMode: boolean;
  existingPlaylist?: any;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePlaylistMutations() {
  const queryClient = useQueryClient();

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
        created_by: user.id,
        genre_id: playlistData.selectedGenres[0]?.id || null,
        mood_id: playlistData.selectedMoods[0]?.id || null,
        is_public: playlistData.isPublic || false,
        is_catalog: playlistData.isCatalog || false,
        assigned_to: playlistData.selectedUsers.map((user: any) => user.id)
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

        // Remove existing assignments
        await supabase
          .from('playlist_assignments')
          .delete()
          .eq('playlist_id', existingPlaylist.id);
      } else {
        const { data, error } = await supabase
          .from('playlists')
          .insert([playlistPayload])
          .select()
          .single();

        if (error) throw error;
        playlist = data;
      }

      // Create new assignments and send notifications for non-catalog playlists
      if (!playlistData.isCatalog && playlistData.selectedUsers.length > 0) {
        const assignments = playlistData.selectedUsers.map((user: any) => ({
          playlist_id: playlist.id,
          user_id: user.id,
          notification_sent: false
        }));

        // First create all assignments
        const { error: assignmentError } = await supabase
          .from('playlist_assignments')
          .insert(assignments);

        if (assignmentError) throw assignmentError;

        // Then send notifications for the created assignments
        for (const user of playlistData.selectedUsers) {
          try {
            await createPlaylistAssignmentNotification(
              user.id, 
              playlistData.title,
              playlist.id,
              artwork_url
            );
          } catch (error) {
            console.error('Error sending notification:', error);
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['playlists'] });
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving playlist:', error);
      onError?.(error);
      throw error;
    }
  };

  return { handleSavePlaylist };
}