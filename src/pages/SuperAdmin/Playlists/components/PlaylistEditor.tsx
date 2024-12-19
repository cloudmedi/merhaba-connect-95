import { useState, useEffect } from "react";
import { PlaylistForm } from "@/components/playlists/PlaylistForm";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { PlaylistTabs } from "@/components/playlists/PlaylistTabs";
import { PlaylistSettings } from "@/components/playlists/PlaylistSettings";
import { AssignManagersDialog } from "@/components/playlists/AssignManagersDialog";
import { usePlaylistMutations } from "@/components/playlists/hooks/usePlaylistMutations";
import { usePlaylistAssignment } from "@/components/playlists/hooks/usePlaylistAssignment";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export function PlaylistEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSavePlaylist } = usePlaylistMutations();
  const existingPlaylist = location.state?.playlistData;
  const { isAssignDialogOpen, setIsAssignDialogOpen, handleAssignManagers } = 
    usePlaylistAssignment(existingPlaylist?._id);
  
  const [playlistData, setPlaylistData] = useState({
    name: "",
    description: "",
    artwork: null as File | null,
    artworkUrl: "",
    selectedSongs: [],
    selectedGenres: [],
    selectedCategories: [],
    selectedMoods: [],
    isCatalog: false,
    isPublic: false,
    isHero: false,
    assignedManagers: []
  });

  const isEditMode = location.state?.editMode;

  useEffect(() => {
    if (isEditMode && existingPlaylist) {
      console.log('Loading existing playlist data:', existingPlaylist);
      loadExistingPlaylistData();
    }
  }, [isEditMode, existingPlaylist]);

  const loadExistingPlaylistData = async () => {
    try {
      console.log('Loading playlist details for ID:', existingPlaylist._id);
      
      const [playlistSongs, playlistCategories, assignedManagers] = await Promise.all([
        axios.get(`/admin/playlists/${existingPlaylist._id}/songs`),
        axios.get(`/admin/playlists/${existingPlaylist._id}/categories`),
        axios.get(`/admin/playlists/${existingPlaylist._id}/managers`)
      ]);

      console.log('Loaded playlist data:', {
        songs: playlistSongs.data,
        categories: playlistCategories.data,
        managers: assignedManagers.data
      });

      setPlaylistData({
        name: existingPlaylist.name,
        description: existingPlaylist.description || "",
        artwork: null,
        artworkUrl: existingPlaylist.artworkUrl || "",
        selectedSongs: playlistSongs.data || [],
        selectedGenres: existingPlaylist.genre ? [existingPlaylist.genre] : [],
        selectedCategories: playlistCategories.data || [],
        selectedMoods: existingPlaylist.mood ? [existingPlaylist.mood] : [],
        isCatalog: false,
        isPublic: existingPlaylist.isPublic || false,
        isHero: existingPlaylist.isHero || false,
        assignedManagers: assignedManagers.data || []
      });
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      toast.error("Failed to load playlist details");
    }
  };

  const handleRemoveSong = (songId: string) => {
    console.log('Removing song:', songId);
    setPlaylistData(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.filter((song: any) => song._id !== songId)
    }));
  };

  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg">
      <PlaylistForm 
        playlistData={playlistData} 
        setPlaylistData={setPlaylistData}
        isEditMode={isEditMode}
      />
      
      <div className="flex-1 space-y-6">
        <PlaylistHeader
          onCancel={() => navigate("/super-admin/playlists")}
          onCreate={() => handleSavePlaylist({
            playlistData,
            isEditMode,
            existingPlaylist,
            onSuccess: () => {
              toast.success(`Playlist ${isEditMode ? 'updated' : 'created'} successfully`);
              navigate("/super-admin/playlists", { replace: true });
            },
            onError: (error) => {
              toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} playlist`);
            }
          })}
          isEditMode={isEditMode}
        />

        <PlaylistSettings
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
          onRemoveSong={handleRemoveSong}
        />

        <AssignManagersDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          playlistId={existingPlaylist?._id || ''}
          initialSelectedManagers={playlistData.assignedManagers}
          onAssign={handleAssignManagers}
        />
      </div>
    </div>
  );
}