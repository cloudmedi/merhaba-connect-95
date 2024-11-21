import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTabs } from "./PlaylistTabs";
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

  useEffect(() => {
    if (location.state?.selectedSongs) {
      setPlaylistData(prev => ({
        ...prev,
        selectedSongs: Array.isArray(location.state.selectedSongs) 
          ? location.state.selectedSongs 
          : [location.state.selectedSongs]
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      let artwork_url = null;
      if (playlistData.artwork) {
        const file = playlistData.artwork;
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        // Upload to Bunny CDN via Edge Function
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);

        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-artwork', {
          body: formData
        });

        if (uploadError) throw uploadError;
        
        artwork_url = uploadData.url;
        console.log("Uploaded artwork URL:", artwork_url);
      }

      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert([
          {
            name: playlistData.title,
            description: playlistData.description,
            artwork_url,
            is_public: false,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (playlistError) throw playlistError;

      if (playlistData.selectedSongs.length > 0) {
        const playlistSongs = playlistData.selectedSongs.map((song: any, index: number) => ({
          playlist_id: playlist.id,
          song_id: song.id,
          position: index
        }));

        const { error: songsError } = await supabase
          .from('playlist_songs')
          .insert(playlistSongs);

        if (songsError) throw songsError;
      }

      if (playlistData.selectedCategories.length > 0) {
        const playlistCategories = playlistData.selectedCategories.map((category: any) => ({
          playlist_id: playlist.id,
          category_id: category.id
        }));

        const { error: categoriesError } = await supabase
          .from('playlist_categories')
          .insert(playlistCategories);

        if (categoriesError) throw categoriesError;
      }

      toast({
        title: "Success",
        description: "Playlist created successfully",
      });
      
      navigate("/super-admin/playlists");
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
  );
}