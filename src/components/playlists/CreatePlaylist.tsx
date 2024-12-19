import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTabs } from "./PlaylistTabs";
import { PlaylistSettings } from "./PlaylistSettings";
import { AssignManagersDialog } from "./AssignManagersDialog";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";
import { usePlaylistAssignment } from "./hooks/usePlaylistAssignment";
import axios from "@/lib/axios";
import { toast } from "sonner";

export function CreatePlaylist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSavePlaylist } = usePlaylistMutations();
  const existingPlaylist = location.state?.playlistData;
  const { isAssignDialogOpen, setIsAssignDialogOpen, handleAssignManagers } = 
    usePlaylistAssignment(existingPlaylist?._id);
  
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    artworkUrl: "",  // artwork_url -> artworkUrl olarak değiştirildi
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
    } else if (location.state?.selectedSongs) {
      setPlaylistData(prev => ({
        ...prev,
        selectedSongs: Array.isArray(location.state.selectedSongs) 
          ? location.state.selectedSongs 
          : [location.state.selectedSongs]
      }));
    }
  }, [isEditMode, existingPlaylist, location.state]);

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
        title: existingPlaylist.name,
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

  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg">
      <PlaylistForm playlistData={playlistData} setPlaylistData={setPlaylistData} />
      
      <div className="flex-1 space-y-6">
        <PlaylistHeader
          onCancel={() => navigate("/super-admin/playlists")}
          onCreate={() => handleSavePlaylist({
            playlistData: {
              ...playlistData,
              artwork_url: playlistData.artworkUrl // artworkUrl'i artwork_url olarak eşleştir
            },
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

        <Button
          onClick={() => setIsAssignDialogOpen(true)}
          className="w-full bg-purple-100 text-purple-600 hover:bg-purple-200"
          size="lg"
        >
          <Users className="w-4 h-4 mr-2" />
          {playlistData.assignedManagers.length > 0 
            ? `Assigned to ${playlistData.assignedManagers.length} Manager${playlistData.assignedManagers.length > 1 ? 's' : ''}`
            : "Assign to Managers"}
        </Button>

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
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