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
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Manager } from "./types";

export function CreatePlaylist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSavePlaylist } = usePlaylistMutations();
  const existingPlaylist = location.state?.playlistData;
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
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
    assignedManagers: [] as Manager[]
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
    } catch (error) {
      console.error('Error loading playlist details:', error);
      toast.error("Failed to load playlist details");
    }
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

        <Button
          onClick={() => setIsAssignDialogOpen(true)}
          className="w-full bg-purple-100 text-purple-600 hover:bg-purple-200"
          size="lg"
        >
          <Users className="w-4 h-4 mr-2" />
          {playlistData.assignedManagers.length > 0 
            ? `${playlistData.assignedManagers.length} Manager${playlistData.assignedManagers.length > 1 ? 's' : ''} Selected`
            : "Assign to Managers"}
        </Button>

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />

        <AssignManagersDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          initialSelectedManagers={playlistData.assignedManagers}
          onManagersSelected={handleManagerSelection}
        />
      </div>
    </div>
  );
}