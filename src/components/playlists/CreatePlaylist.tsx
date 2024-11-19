import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users, Tag, Grid2X2, Heart } from "lucide-react";
import { PlaylistForm } from "./PlaylistForm";
import { SongsTab } from "./SongsTab";
import { useNavigate } from "react-router-dom";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

export function CreatePlaylist() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    selectedSongs: [] as Song[],
  });

  const handleCreatePlaylist = () => {
    if (!playlistData.title) {
      toast({
        title: "Hata",
        description: "Lütfen playlist başlığını girin",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı",
      description: "Playlist başarıyla oluşturuldu",
    });
    
    navigate("/super-admin/playlists");
  };

  const handleAddSong = (song: Song) => {
    if (!playlistData.selectedSongs.find(s => s.id === song.id)) {
      setPlaylistData(prev => ({
        ...prev,
        selectedSongs: [...prev.selectedSongs, song],
      }));
    }
  };

  const handleRemoveSong = (songId: number) => {
    setPlaylistData(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.filter(s => s.id !== songId),
    }));
  };

  return (
    <div className="flex gap-6 p-6">
      <PlaylistForm playlistData={playlistData} setPlaylistData={setPlaylistData} />
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Yeni Playlist Oluştur</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/super-admin/playlists")}>
              İptal
            </Button>
            <Button onClick={handleCreatePlaylist}>
              Playlist Oluştur
            </Button>
          </div>
        </div>

        <Tabs defaultValue="songs">
          <TabsList>
            <TabsTrigger value="songs">
              <Music className="w-4 h-4 mr-2" />
              Şarkılar
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="genres">
              <Tag className="w-4 h-4 mr-2" />
              Türler
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Grid2X2 className="w-4 h-4 mr-2" />
              Kategoriler
            </TabsTrigger>
            <TabsTrigger value="moods">
              <Heart className="w-4 h-4 mr-2" />
              Modlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="mt-4">
            <SongsTab
              selectedSongs={playlistData.selectedSongs}
              onAddSong={handleAddSong}
              onRemoveSong={handleRemoveSong}
            />
          </TabsContent>

          <TabsContent value="users">
            <div className="p-4 text-center text-gray-500">
              Kullanıcı seçimi yakında eklenecek
            </div>
          </TabsContent>

          <TabsContent value="genres">
            <div className="p-4 text-center text-gray-500">
              Tür seçimi yakında eklenecek
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="p-4 text-center text-gray-500">
              Kategori seçimi yakında eklenecek
            </div>
          </TabsContent>

          <TabsContent value="moods">
            <div className="p-4 text-center text-gray-500">
              Mod seçimi yakında eklenecek
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}