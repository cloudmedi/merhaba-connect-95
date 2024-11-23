import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTabs } from "./PlaylistTabs";
import { supabase } from "@/integrations/supabase/client";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CreatePlaylist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { handleSavePlaylist } = usePlaylistMutations();
  
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
    isPublic: false
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
            isPublic: existingPlaylist.is_public || false
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

  const onSave = async () => {
    try {
      await handleSavePlaylist({
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
      });
    } catch (error: any) {
      console.error('Error saving playlist:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} playlist`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg">
      <PlaylistForm playlistData={playlistData} setPlaylistData={setPlaylistData} />
      
      <div className="flex-1">
        <PlaylistHeader
          onCancel={() => navigate("/super-admin/playlists", { replace: true })}
          onCreate={onSave}
          isEditMode={isEditMode}
        />

        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="catalog-mode"
              checked={playlistData.isCatalog}
              onCheckedChange={(checked) => 
                setPlaylistData(prev => ({ ...prev, isCatalog: checked }))
              }
            />
            <Label htmlFor="catalog-mode">Add to Catalog (visible to all managers)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public-mode"
              checked={playlistData.isPublic}
              onCheckedChange={(checked) => 
                setPlaylistData(prev => ({ ...prev, isPublic: checked }))
              }
            />
            <Label htmlFor="public-mode">Make Public</Label>
          </div>
        </div>

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />
      </div>
    </div>
  );
}