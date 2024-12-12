import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function BulkPlaylistGenerator() {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectionMethod, setSelectionMethod] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePlaylist = async () => {
    if (!selectedGenre || !selectionMethod || !playlistName) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch songs based on selection method
      const { data: songs } = await supabase
        .from('songs')
        .select('*')
        .contains('genre', [selectedGenre])
        .order(selectionMethod === 'latest' ? 'created_at' : '.random()')
        .limit(500);

      if (!songs || songs.length < 500) {
        toast.error(`Bu genre'da yeterli şarkı yok (${songs?.length || 0} şarkı bulundu)`);
        return;
      }

      // Create playlist
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert({
          name: playlistName,
          description: `${selectionMethod === 'latest' ? 'En yeni' : 'Rastgele'} 500 ${selectedGenre} şarkısı`,
          is_public: true
        })
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Add songs to playlist
      const playlistSongs = songs.map((song, index) => ({
        playlist_id: playlist.id,
        song_id: song.id,
        position: index
      }));

      const { error: songsError } = await supabase
        .from('playlist_songs')
        .insert(playlistSongs);

      if (songsError) throw songsError;

      toast.success("Playlist başarıyla oluşturuldu!");
      navigate(`/super-admin/playlists/${playlist.id}`);

    } catch (error) {
      console.error('Error generating playlist:', error);
      toast.error("Playlist oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Toplu Playlist Oluştur</h2>
        <p className="text-sm text-gray-500">
          Seçtiğiniz genre'dan 500 şarkı ile otomatik playlist oluşturun
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Playlist Adı</label>
          <Input
            placeholder="Playlist adını girin"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Genre Seçin</label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Genre seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chill Hop">Chill Hop</SelectItem>
              <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
              <SelectItem value="Jazz">Jazz</SelectItem>
              {/* Diğer genre'lar buraya eklenebilir */}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Seçim Metodu</label>
          <Select value={selectionMethod} onValueChange={setSelectionMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Seçim metodunu belirleyin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">En Yeni 500 Şarkı</SelectItem>
              <SelectItem value="random">Rastgele 500 Şarkı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full" 
          onClick={handleGeneratePlaylist}
          disabled={isLoading}
        >
          {isLoading ? "Oluşturuluyor..." : "Playlist Oluştur"}
        </Button>
      </div>
    </div>
  );
}