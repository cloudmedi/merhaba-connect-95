import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreatePlaylistForm } from "./CreatePlaylistForm";
import { PlaylistSettings } from "./PlaylistSettings";
import { PlaylistTabs } from "./PlaylistTabs";
import { Button } from "@/components/ui/button";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";

export function CreatePlaylist() {
  const navigate = useNavigate();
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

  const handleCreate = async () => {
    try {
      await handleSavePlaylist({
        playlistData,
        isEditMode: false,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Playlist created successfully",
          });
          navigate("/super-admin/playlists", { replace: true });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to create playlist",
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create playlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg">
      <CreatePlaylistForm 
        playlistData={playlistData} 
        setPlaylistData={setPlaylistData} 
      />
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create New Playlist</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/super-admin/playlists")}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Playlist
            </Button>
          </div>
        </div>

        <PlaylistSettings
          isCatalog={playlistData.isCatalog}
          isPublic={playlistData.isPublic}
          onCatalogChange={(checked) => setPlaylistData(prev => ({ ...prev, isCatalog: checked }))}
          onPublicChange={(checked) => setPlaylistData(prev => ({ ...prev, isPublic: checked }))}
        />

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />
      </div>
    </div>
  );
}