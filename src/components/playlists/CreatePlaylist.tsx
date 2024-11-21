import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTabs } from "./PlaylistTabs";
import { supabase } from "@/integrations/supabase/client";

export function CreatePlaylist() {
  const navigate = useNavigate();
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

  const handleCreatePlaylist = async () => {
    if (!playlistData.title) {
      toast({
        title: "Hata",
        description: "Lütfen playlist başlığı giriniz",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload artwork if exists
      let artwork_url = null;
      if (playlistData.artwork) {
        const file = playlistData.artwork;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('playlists')
          .upload(`artworks/${fileName}`, file);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('playlists')
          .getPublicUrl(`artworks/${fileName}`);
          
        artwork_url = publicUrl;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Create playlist
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

      // Add songs to playlist if any selected
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

      // Add users to playlist if any selected
      if (playlistData.selectedUsers.length > 0) {
        // Here you would typically insert into a playlist_users table
        // But since it's not in the schema, we'll need to handle user access differently
        // For now, we'll just show a toast message
        console.log('Selected users:', playlistData.selectedUsers);
      }

      toast({
        title: "Başarılı",
        description: "Playlist başarıyla oluşturuldu",
      });
      
      navigate("/super-admin/playlists");
    } catch (error: any) {
      console.error('Playlist oluşturma hatası:', error);
      toast({
        title: "Hata",
        description: error.message || "Playlist oluşturulamadı",
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