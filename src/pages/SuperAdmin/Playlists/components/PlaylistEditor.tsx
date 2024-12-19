import { useState } from "react";
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
    usePlaylistAssignment(existingPlaylist?.id);
  
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    artwork_url: "",
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

  const handleRemoveSong = (songId: string) => {
    console.log('Removing song:', songId);
    setPlaylistData(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.filter((song: any) => song._id !== songId)
    }));
  };

  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg">
      <PlaylistForm playlistData={playlistData} setPlaylistData={setPlaylistData} />
      
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
          playlistId={existingPlaylist?.id || ''}
          initialSelectedManagers={playlistData.assignedManagers}
          onAssign={handleAssignManagers}
        />
      </div>
    </div>
  );
}