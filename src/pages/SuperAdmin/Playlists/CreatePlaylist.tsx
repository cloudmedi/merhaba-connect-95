import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistForm } from "@/components/playlists/PlaylistForm";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { PlaylistTabs } from "@/components/playlists/PlaylistTabs";
import { PlaylistSettings } from "@/components/playlists/PlaylistSettings";
import { AssignManagersDialog } from "@/components/playlists/AssignManagersDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CreatePlaylist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
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

  const handleCreatePlaylist = async () => {
    if (!playlistData.title) {
      toast({
        title: "Error",
        description: "Please enter a playlist title",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert([{
          name: playlistData.title,
          description: playlistData.description,
          artwork_url: playlistData.artwork_url,
          is_catalog: playlistData.isCatalog,
          is_public: playlistData.isPublic,
          is_hero: playlistData.isHero,
          genre_id: playlistData.selectedGenres[0]?.id,
          mood_id: playlistData.selectedMoods[0]?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Playlist created successfully",
      });
      
      navigate("/super-admin/playlists");
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout 
      title="Create New Playlist" 
      description="Create and customize your playlist"
    >
      <div className="flex gap-6 p-6 bg-white rounded-lg">
        <PlaylistForm playlistData={playlistData} setPlaylistData={setPlaylistData} />
        
        <div className="flex-1">
          <PlaylistHeader
            onCancel={() => navigate("/super-admin/playlists")}
            onCreate={handleCreatePlaylist}
            isEditMode={isEditMode}
          />

          <PlaylistSettings
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
          />

          <PlaylistTabs
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
          />

          <div className="mt-6">
            <button
              onClick={() => setIsAssignDialogOpen(true)}
              className="w-full py-2 px-4 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Assign to Managers
            </button>
          </div>

          <AssignManagersDialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
            onAssign={async (managerIds, scheduledAt, expiresAt) => {
              try {
                if (!existingPlaylist?.id) {
                  toast({
                    title: "Error",
                    description: "Please save the playlist first before assigning to managers",
                    variant: "destructive",
                  });
                  return;
                }

                const assignments = managerIds.map(userId => ({
                  user_id: userId,
                  playlist_id: existingPlaylist.id,
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
    </DashboardLayout>
  );
}