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

      console.log('Initial playlist data:', playlistData);

      let artworkUrl = playlistData.artwork_url;

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
        artworkUrl = uploadResponse.data.url;
      }

      // Prepare payload according to MongoDB schema
      const playlistPayload = {
        name: playlistData.title,
        description: playlistData.description,
        artworkUrl: artworkUrl,
        isPublic: playlistData.isPublic || false,
        isHero: playlistData.isHero || false,
        genre: playlistData.selectedGenres?.[0]?._id || null,
        mood: playlistData.selectedMoods?.[0]?._id || null,
        categories: playlistData.selectedCategories
          .filter((cat: any) => cat && cat._id)
          .map((cat: any) => cat._id),
        songs: playlistData.selectedSongs.map((song: any, index: number) => ({
          songId: song._id,
          position: index
        })),
        assignedManagers: playlistData.assignedManagers
          .filter((manager: any) => manager && manager._id)
          .map((manager: any) => manager._id)
      };

      console.log('Sending playlist payload:', playlistPayload);
      
      let response;
      if (isEditMode && existingPlaylist) {
        response = await axios.put(`/admin/playlists/${existingPlaylist.id}`, playlistPayload);
      } else {
        response = await axios.post('/admin/playlists', playlistPayload);
      }

      console.log('Server response:', response.data);

      await queryClient.invalidateQueries({ queryKey: ['playlists'] });
      
      toast.success(`Playlist ${isEditMode ? 'updated' : 'created'} successfully`);
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error saving playlist:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
      
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} playlist`);
      onError?.(error);
      throw error;
    }
  };

  return { handleSavePlaylist };
}