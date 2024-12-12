import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlaySquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MusicFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  genres: string[];
  onSelectAll: () => void;
  selectedCount: number;
}

export function MusicFilters({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  onSelectAll,
  selectedCount,
}: MusicFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkPlaylistName, setBulkPlaylistName] = useState("");
  const [selectionMethod, setSelectionMethod] = useState("latest");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateBulkPlaylist = async () => {
    if (!bulkPlaylistName.trim()) {
      toast.error("Lütfen playlist adı girin");
      return;
    }

    if (!selectedGenre || selectedGenre === "all") {
      toast.error("Lütfen bir genre seçin");
      return;
    }

    setIsCreating(true);

    try {
      // Şarkıları seç
      let query = supabase
        .from('songs')
        .select('*')
        .contains('genre', [selectedGenre])
        .limit(500);

      if (selectionMethod === "latest") {
        query = query.order('created_at', { ascending: false });
      } else if (selectionMethod === "random") {
        query = query.order('created_at', { ascending: undefined }); // Random sıralama için
      }

      const { data: songs, error: songsError } = await query;

      if (songsError) throw songsError;

      // Playlist oluştur
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert([{
          name: bulkPlaylistName,
          genre_id: selectedGenre,
          is_public: true
        }])
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Şarkıları playlist'e ekle
      const playlistSongs = songs.map((song, index) => ({
        playlist_id: playlist.id,
        song_id: song.id,
        position: index
      }));

      const { error: assignError } = await supabase
        .from('playlist_songs')
        .insert(playlistSongs);

      if (assignError) throw assignError;

      toast.success("Playlist başarıyla oluşturuldu!");
      setIsDialogOpen(false);
      setBulkPlaylistName("");
      setSelectionMethod("latest");
      
      // Playlist detay sayfasına yönlendir
      navigate("/super-admin/playlists/create", { 
        state: { 
          editMode: true, 
          playlistData: playlist 
        } 
      });
    } catch (error: any) {
      toast.error("Playlist oluşturulurken hata: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <PlaySquare className="h-4 w-4" />
              Bulk Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Bulk Playlist</DialogTitle>
            </DialogHeader>
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
                <label className="text-sm font-medium">Selection Method</label>
                <Select value={selectionMethod} onValueChange={setSelectionMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest 500 songs</SelectItem>
                    <SelectItem value="random">Random 500 songs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateBulkPlaylist}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Playlist"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Button 
        variant="outline" 
        onClick={onSelectAll}
        className="whitespace-nowrap"
      >
        {selectedCount > 0 ? "Clear Selection" : "Select All Filtered"}
      </Button>
    </div>
  );
}