import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistForm } from "@/components/playlists/PlaylistForm";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { PlaylistTabs } from "@/components/playlists/PlaylistTabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CreatePlaylist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    selectedSongs: [],
    selectedUsers: [],
    selectedGenres: [],
    selectedCategories: [],
    selectedMoods: [],
  });

  // Initialize selected songs from navigation state
  useEffect(() => {
    if (location.state?.selectedSongs) {
      setPlaylistData(prev => ({
        ...prev,
        selectedSongs: location.state.selectedSongs
      }));
    }
  }, [location.state]);

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
        .insert([
          {
            name: playlistData.title,
            description: playlistData.description,
            // Add other fields as needed
          }
        ])
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
          />

          <PlaylistTabs
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}