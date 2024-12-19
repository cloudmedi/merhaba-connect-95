import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";

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

      let artwork_url = playlistData.artwork_url;

      // Handle file upload if there's new artwork
      if (playlistData.artwork) {
        console.log('Uploading artwork to:', '/admin/playlists/upload-artwork');
        const formData = new FormData();
        formData.append('file', playlistData.artwork);
        
        const uploadResponse = await axios.post('/admin/playlists/upload-artwork', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Artwork upload response:', uploadResponse.data);
        artwork_url = uploadResponse.data.url;
      }

      const playlistPayload = {
        name: playlistData.title,
        description: playlistData.description,
        artwork_url,
        genre_id: playlistData.selectedGenres[0]?.id || null,
        mood_id: playlistData.selectedMoods[0]?.id || null,
        is_public: playlistData.isPublic || false,
        is_catalog: playlistData.isCatalog || false,
        is_hero: playlistData.isHero || false,
        songs: playlistData.selectedSongs.map((song: any) => song._id),
        categories: playlistData.selectedCategories.map((cat: any) => cat.id)
      };

      console.log('Saving playlist with payload:', playlistPayload);
      let response;
      if (isEditMode && existingPlaylist) {
        response = await axios.put(`/admin/playlists/${existingPlaylist.id}`, playlistPayload);
      } else {
        response = await axios.post('/admin/playlists', playlistPayload);
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