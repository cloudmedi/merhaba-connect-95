import { useQueryClient } from "@tanstack/react-query";
import { playlistService } from "@/services/playlist-service";
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
        const formData = new FormData();
        formData.append('file', playlistData.artwork);
        
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload-artwork`, {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload artwork');
        }
        
        const uploadData = await uploadResponse.json();
        artwork_url = uploadData.url;
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
        songs: playlistData.selectedSongs.map((song: any) => song.id)
      };

      let playlist;
      if (isEditMode && existingPlaylist) {
        playlist = await playlistService.updatePlaylist(existingPlaylist.id, playlistPayload);
      } else {
        playlist = await playlistService.createPlaylist(playlistPayload);
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