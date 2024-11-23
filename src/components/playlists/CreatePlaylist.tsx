import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTabs } from "./PlaylistTabs";
import { PlaylistSettings } from "./PlaylistSettings";
import { AssignManagersDialog } from "./AssignManagersDialog";
import { supabase } from "@/integrations/supabase/client";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";

export function CreatePlaylist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { handleSavePlaylist } = usePlaylistMutations();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    artwork_url: "",
    selectedSongs: [],
    selectedUsers: [],
    selectedGenres: [],
    selectedCategories: [],
    selectedMoods: [],
    isCatalog: false,
    isPublic: false,
    isHero: false
  });

  const isEditMode = location.state?.editMode;
  const existingPlaylist = location.state?.playlistData;

  useEffect(() => {
    if (isEditMode && existingPlaylist) {
      const fetchPlaylistDetails = async () => {
        try {
          const { data: playlistSongs } = await supabase
            .from('playlist_songs')
            .select('songs(*)')
            .eq('playlist_id', existingPlaylist.id)
            .order('position');

          const { data: playlistCategories } = await supabase
            .from('playlist_categories')
            .select('categories(*)')
            .eq('playlist_id', existingPlaylist.id);

          setPlaylistData({
            title: existingPlaylist.name,
            description: existingPlaylist.description || "",
            artwork: null,
            artwork_url: existingPlaylist.artwork_url || "",
            selectedSongs: playlistSongs?.map(ps => ps.songs) || [],
            selectedUsers: [],
            selectedGenres: existingPlaylist.genre_id ? [{ id: existingPlaylist.genre_id }] : [],
            selectedCategories: playlistCategories?.map(pc => pc.categories) || [],
            selectedMoods: existingPlaylist.mood_id ? [{ id: existingPlaylist.mood_id }] : [],
            isCatalog: existingPlaylist.is_catalog || false,
            isPublic: existingPlaylist.is_public || false,
            isHero: existingPlaylist.is_hero || false
          });
        } catch (error) {
          console.error('Error fetching playlist details:', error);
          toast({
            title: "Error",
            description: "Failed to load playlist details",
            variant: "destructive",
          });
        }
      };

      fetchPlaylistDetails();
    } else if (location.state?.selectedSongs) {
      setPlaylistData(prev => ({
        ...prev,
        selectedSongs: Array.isArray(location.state.selectedSongs) 
          ? location.state.selectedSongs 
          : [location.state.selectedSongs]
      }));
    }
  }, [isEditMode, existingPlaylist, location.state]);

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
              toast({
                title: "Success",
                description: `Playlist ${isEditMode ? 'updated' : 'created'} successfully`,
              });
              navigate("/super-admin/playlists", { replace: true });
            },
            onError: (error) => {
              toast({
                title: "Error",
                description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} playlist`,
                variant: "destructive",
              });
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
          Assign to Managers
        </Button>

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />

        <AssignManagersDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          onAssign={async (managerIds, scheduledAt, expiresAt) => {
            try {
              const assignments = managerIds.map(userId => ({
                user_id: userId,
                playlist_id: existingPlaylist?.id,
                scheduled_at: scheduledAt?.toISOString() || new Date().toISOString(),
                expires_at: expiresAt?.toISOString() || null,
                notification_sent: false
              }));

              const { error } = await supabase
                .from('playlist_assignments')
                .insert(assignments);

              if (error) throw error;

              toast({
                title: "Success",
                description: `Playlist assigned to ${managerIds.length} managers`,
              });

              setIsAssignDialogOpen(false);
            } catch (error: any) {
              console.error('Error assigning playlist:', error);
              toast({
                title: "Error",
                description: error.message || "Failed to assign playlist",
                variant: "destructive",
              });
            }
          }}
        />
      </div>
    </div>
  );
}