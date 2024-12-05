import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTabs } from "./PlaylistTabs";
import { PlaylistSettings } from "./PlaylistSettings";
import { AssignManagersDialog } from "./AssignManagersDialog";
import { supabase } from "@/integrations/supabase/client";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";
import { usePlaylistAssignment } from "./hooks/usePlaylistAssignment";
import { toast } from "sonner";

export function CreatePlaylist() {
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

  useEffect(() => {
    if (isEditMode && existingPlaylist) {
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
      const [playlistSongs, playlistCategories, assignedManagers] = await Promise.all([
        supabase
          .from('playlist_songs')
          .select('songs(*)')
          .eq('playlist_id', existingPlaylist.id)
          .order('position'),
        
        supabase
          .from('playlist_categories')
          .select('categories(*)')
          .eq('playlist_id', existingPlaylist.id),
        
        supabase
          .from('playlist_assignments')
          .select(`
            user_id,
            profiles:user_id (
              id,
              first_name,
              last_name,
              email,
              avatar_url
            )
          `)
          .eq('playlist_id', existingPlaylist.id)
      ]);

      setPlaylistData({
        title: existingPlaylist.name,
        description: existingPlaylist.description || "",
        artwork: null,
        artwork_url: existingPlaylist.artwork_url || "",
        selectedSongs: playlistSongs.data?.map(ps => ps.songs) || [],
        selectedGenres: existingPlaylist.genre_id ? [{ id: existingPlaylist.genre_id }] : [],
        selectedCategories: playlistCategories.data?.map(pc => pc.categories) || [],
        selectedMoods: existingPlaylist.mood_id ? [{ id: existingPlaylist.mood_id }] : [],
        isCatalog: existingPlaylist.is_catalog || false,
        isPublic: existingPlaylist.is_public || false,
        isHero: existingPlaylist.is_hero || false,
        assignedManagers: assignedManagers.data?.map(am => am.profiles) || []
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
          playlistId={existingPlaylist?.id || ''}
          initialSelectedManagers={playlistData.assignedManagers}
          onAssign={handleAssignManagers}
        />
      </div>
    </div>
  );
}