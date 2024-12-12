import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Genre {
  id: string;
  name: string;
  description?: string | null;
}

interface BulkPlaylistFormProps {
  genres: Genre[];
  onClose: () => void;
}

export function BulkPlaylistForm({ genres, onClose }: BulkPlaylistFormProps) {
  const [bulkPlaylistName, setBulkPlaylistName] = useState("");
  const [selectionMethod, setSelectionMethod] = useState("latest");
  const [songLimit, setSongLimit] = useState(500);
  const [selectedGenreId, setSelectedGenreId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateBulkPlaylist = async () => {
    if (!bulkPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    if (!selectedGenreId) {
      toast.error("Please select a genre");
      return;
    }

    setIsCreating(true);

    try {
      // 1. Önce seçilen genre'a ait şarkıları al
      let query = supabase
        .from('songs')
        .select('*')
        .contains('genre', [genres.find(g => g.id === selectedGenreId)?.name])
        .limit(songLimit);

      if (selectionMethod === "latest") {
        query = query.order('created_at', { ascending: false });
      } else if (selectionMethod === "random") {
        query = query.order('created_at', { ascending: undefined }); 
      }

      const { data: songs, error: songsError } = await query;

      if (songsError) throw songsError;
      if (!songs || songs.length === 0) {
        throw new Error("No songs found for selected genre");
      }

      // 2. Yeni playlist oluştur
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert([{
          name: bulkPlaylistName,
          description: `Auto-generated playlist for ${genres.find(g => g.id === selectedGenreId)?.name} genre`,
          genre_id: selectedGenreId,
          is_public: false,
          is_catalog: false,
          is_hero: false
        }])
        .select()
        .single();

      if (playlistError) throw playlistError;

      // 3. Şarkıları playlist'e ekle
      const playlistSongs = songs.map((song, index) => ({
        playlist_id: playlist.id,
        song_id: song.id,
        position: index
      }));

      const { error: assignError } = await supabase
        .from('playlist_songs')
        .insert(playlistSongs);

      if (assignError) throw assignError;

      toast.success("Playlist created successfully!");
      onClose();
      
      // Playlist edit sayfasına yönlendir
      navigate("/super-admin/playlists/create", { 
        state: { 
          editMode: true, 
          playlistData: playlist 
        } 
      });
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      toast.error(error.message || "Failed to create playlist");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Playlist Name</label>
        <Input
          placeholder="Enter playlist name"
          value={bulkPlaylistName}
          onChange={(e) => setBulkPlaylistName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Genre</label>
        <Select value={selectedGenreId} onValueChange={setSelectedGenreId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Selection Method</label>
        <Select value={selectionMethod} onValueChange={setSelectionMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest songs</SelectItem>
            <SelectItem value="random">Random songs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Number of Songs</label>
        <Input
          type="number"
          min="1"
          max="500"
          value={songLimit}
          onChange={(e) => setSongLimit(Number(e.target.value))}
          placeholder="Enter number of songs (max 500)"
        />
      </div>

      <Button 
        className="w-full" 
        onClick={handleCreateBulkPlaylist}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Playlist"}
      </Button>
    </div>
  );
}