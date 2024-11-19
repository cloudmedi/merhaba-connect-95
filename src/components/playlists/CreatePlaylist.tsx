import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users, Tag, Grid2X2, Heart } from "lucide-react";
import { PlaylistForm } from "./PlaylistForm";
import { SongsTab } from "./SongsTab";
import { UsersTab } from "./UsersTab";
import { GenresTab } from "./GenresTab";
import { CategoriesTab } from "./CategoriesTab";
import { useNavigate } from "react-router-dom";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export function CreatePlaylist() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    selectedSongs: [] as Song[],
    selectedUsers: [] as User[],
    selectedGenres: [] as Genre[],
    selectedCategories: [] as Category[],
  });

  const handleCreatePlaylist = () => {
    if (!playlistData.title) {
      toast({
        title: "Error",
        description: "Please enter a playlist title",
        variant: "destructive",
      });
      return;
    }

    if (playlistData.selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one user",
        variant: "destructive",
      });
      return;
    }

    if (playlistData.selectedGenres.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one genre",
        variant: "destructive",
      });
      return;
    }

    if (playlistData.selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
    
    navigate("/super-admin/playlists");
  };

  return (
    <div className="flex gap-6 p-6">
      <PlaylistForm playlistData={playlistData} setPlaylistData={setPlaylistData} />
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Playlist</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/super-admin/playlists")}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlaylist}>
              Create Playlist
            </Button>
          </div>
        </div>

        <Tabs defaultValue="songs">
          <TabsList>
            <TabsTrigger value="songs">
              <Music className="w-4 h-4 mr-2" />
              Songs
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="genres">
              <Tag className="w-4 h-4 mr-2" />
              Genres
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Grid2X2 className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="moods">
              <Heart className="w-4 h-4 mr-2" />
              Moods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="mt-4">
            <SongsTab
              selectedSongs={playlistData.selectedSongs}
              onAddSong={(song) => setPlaylistData(prev => ({
                ...prev,
                selectedSongs: [...prev.selectedSongs, song],
              }))}
              onRemoveSong={(songId) => setPlaylistData(prev => ({
                ...prev,
                selectedSongs: prev.selectedSongs.filter(s => s.id !== songId),
              }))}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <UsersTab
              selectedUsers={playlistData.selectedUsers}
              onSelectUser={(user) => setPlaylistData(prev => ({
                ...prev,
                selectedUsers: [...prev.selectedUsers, user],
              }))}
              onUnselectUser={(userId) => setPlaylistData(prev => ({
                ...prev,
                selectedUsers: prev.selectedUsers.filter(u => u.id !== userId),
              }))}
            />
          </TabsContent>

          <TabsContent value="genres" className="mt-4">
            <GenresTab
              selectedGenres={playlistData.selectedGenres}
              onSelectGenre={(genre) => setPlaylistData(prev => ({
                ...prev,
                selectedGenres: [...prev.selectedGenres, genre],
              }))}
              onUnselectGenre={(genreId) => setPlaylistData(prev => ({
                ...prev,
                selectedGenres: prev.selectedGenres.filter(g => g.id !== genreId),
              }))}
            />
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <CategoriesTab
              selectedCategories={playlistData.selectedCategories}
              onSelectCategory={(category) => setPlaylistData(prev => ({
                ...prev,
                selectedCategories: [...prev.selectedCategories, category],
              }))}
              onUnselectCategory={(categoryId) => setPlaylistData(prev => ({
                ...prev,
                selectedCategories: prev.selectedCategories.filter(c => c.id !== categoryId),
              }))}
            />
          </TabsContent>

          <TabsContent value="moods">
            <div className="p-4 text-center text-gray-500">
              Mood selection coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}