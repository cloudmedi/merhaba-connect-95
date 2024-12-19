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
      setPlaylistData({
        name: existingPlaylist.name,
        description: existingPlaylist.description || "",
        artwork: null,
        artworkUrl: existingPlaylist.artworkUrl || "",
        selectedSongs: existingPlaylist.songs || [],
        selectedGenres: existingPlaylist.genre ? [existingPlaylist.genre] : [],
        selectedCategories: existingPlaylist.categories || [],
        selectedMoods: existingPlaylist.mood ? [existingPlaylist.mood] : [],
        isCatalog: false,
        isPublic: existingPlaylist.isPublic || false,
        isHero: existingPlaylist.isHero || false,
        assignedManagers: existingPlaylist.assignedManagers || []
      });
    }
  }, [isEditMode, existingPlaylist]);

  const handleRemoveSong = (songId: string) => {
    console.log('Removing song:', songId);
    setPlaylistData(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.filter((song: any) => song._id !== songId)
    }));
  };

  const handleManagerSelection = (selectedManagers: Manager[]) => {
    console.log('Selected managers:', selectedManagers);
    setPlaylistData(prev => ({
      ...prev,
      assignedManagers: selectedManagers
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
