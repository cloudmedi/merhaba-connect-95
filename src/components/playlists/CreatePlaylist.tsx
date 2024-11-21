import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
    artwork_url: "",
    selectedSongs: [],
    selectedUsers: [],
    selectedGenres: [],
    selectedCategories: [],
    selectedMoods: [],
  });
  const isEditMode = location.state?.editMode;
  const existingPlaylist = location.state?.playlistData;

  useEffect(() => {
    // Initialize form with existing playlist data if in edit mode
    if (isEditMode && existingPlaylist) {
      const fetchPlaylistDetails = async () => {
        try {
          // Fetch playlist songs
          const { data: playlistSongs } = await supabase
            .from('playlist_songs')
            .select('songs(*)')
            .eq('playlist_id', existingPlaylist.id)
            .order('position');

          // Fetch playlist categories
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

  const handleSavePlaylist = async () => {
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

      let artwork_url = playlistData.artwork_url;
      if (playlistData.artwork) {
        // Convert file to base64
        const reader = new FileReader();
        const fileBase64Promise = new Promise((resolve) => {
          reader.onload = () => {
            const base64 = reader.result?.toString().split(',')[1];
            resolve(base64);
          };
        });
        reader.readAsDataURL(playlistData.artwork);
        const fileBase64 = await fileBase64Promise;

        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-artwork', {
          body: {
            fileData: fileBase64,
            fileName: `${crypto.randomUUID()}.${playlistData.artwork.name.split('.').pop()}`,
            contentType: playlistData.artwork.type
          }
        });

        if (uploadError) throw uploadError;
        artwork_url = uploadData.url;
      }

      const playlistPayload = {
        name: playlistData.title,
        description: playlistData.description,
        artwork_url,
        is_public: false,
        created_by: user.id,
        genre_id: playlistData.selectedGenres[0]?.id || null,
        mood_id: playlistData.selectedMoods[0]?.id || null,
      };

      let playlist;
      if (isEditMode && existingPlaylist) {
        // Update existing playlist
        const { data, error } = await supabase
          .from('playlists')
          .update(playlistPayload)
          .eq('id', existingPlaylist.id)
          .select()
          .single();

        if (error) throw error;
        playlist = data;

        // Delete existing playlist songs and categories
        await supabase.from('playlist_songs').delete().eq('playlist_id', existingPlaylist.id);
        await supabase.from('playlist_categories').delete().eq('playlist_id', existingPlaylist.id);
      } else {
        // Create new playlist
        const { data, error } = await supabase
          .from('playlists')
          .insert([playlistPayload])
          .select()
          .single();

        if (error) throw error;
        playlist = data;
      }

      // Insert playlist songs
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

      // Insert playlist categories
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
        description: `Playlist ${isEditMode ? 'updated' : 'created'} successfully`,
      });
      
      navigate("/super-admin/playlists");
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
          onCancel={() => navigate("/super-admin/playlists")}
          onCreate={handleSavePlaylist}
          isEditMode={isEditMode}
        />

        <PlaylistTabs
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />
      </div>
    </div>
  );
}