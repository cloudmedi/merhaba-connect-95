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
      if (!playlistData.name) {
        throw new Error("Please enter a playlist name");
      }

      console.log('Initial playlist data:', playlistData);
      console.log('Assigned managers before transformation:', playlistData.assignedManagers);

      let artworkUrl = playlistData.artworkUrl;

      // Handle file upload if there's new artwork
      if (playlistData.artwork) {
        console.log('Uploading artwork to:', '/api/admin/playlists/upload-artwork');
        const formData = new FormData();
        formData.append('file', playlistData.artwork);
        
        const uploadResponse = await axios.post('/api/admin/playlists/upload-artwork', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Artwork upload response:', uploadResponse.data);
        artworkUrl = uploadResponse.data.url;
      }

      // Prepare managers data with validation
      const assignedManagers = Array.isArray(playlistData.assignedManagers) 
        ? playlistData.assignedManagers
          .filter((manager: any) => manager && (manager._id || manager.id))
          .map((manager: any) => manager._id || manager.id)
        : [];

      console.log('Processed assigned managers:', assignedManagers);

      // Prepare payload for MongoDB
      const playlistPayload = {
        name: playlistData.name,
        description: playlistData.description,
        artworkUrl,
        isPublic: playlistData.isPublic,
        isHero: playlistData.isHero,
        genre: playlistData.selectedGenres?.[0]?._id || null,
        mood: playlistData.selectedMoods?.[0]?._id || null,
        categories: playlistData.selectedCategories
          .filter((cat: any) => cat && cat._id)
          .map((cat: any) => cat._id),
        songs: playlistData.selectedSongs.map((song: any, index: number) => ({
          songId: song._id,
          position: index
        })),
        assignedManagers // Use the processed managers array
      };

      console.log('Sending playlist payload:', playlistPayload);
      
      let response;
      if (isEditMode && existingPlaylist) {
        // For update, explicitly include the assignedManagers
        response = await axios.put(`/api/admin/playlists/${existingPlaylist._id}`, {
          ...playlistPayload,
          assignedManagers // Ensure managers are included in update
        });
      } else {
        response = await axios.post('/api/admin/playlists', playlistPayload);
      }

      console.log('Server response:', response.data);

      // Invalidate both playlist queries and manager assignments
      await queryClient.invalidateQueries({ queryKey: ['playlists'] });
      if (existingPlaylist?._id) {
        await queryClient.invalidateQueries({ 
          queryKey: ['playlist-managers', existingPlaylist._id] 
        });
      }
      
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error saving playlist:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
      
      onError?.(error);
      throw error;
    }
  };

  return { handleSavePlaylist };
}